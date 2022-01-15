package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func LoadsFile(rw http.ResponseWriter, r *http.Request) {
	fmt.Println("File load.." + r.Host)
	path := mux.Vars(r)
	http.ServeFile(rw, r, "./public/"+path["path"])
}

// Exception Path of validation
func JSONResponseContentType(next http.Handler) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		// Response content type setting
		rw.Header().Add("Content-Type", "application/json")
		rw.Header().Add("Content-Type", "multipart/form-data")

		// Set CORS headers
		rw.Header().Set("Access-Control-Allow-Origin", "*")
		next.ServeHTTP(rw, r)
	})
}

func main() {
	// Main Router generate
	router := mux.NewRouter()
	router.Use(mux.CORSMethodMiddleware(router))
	router.Use(JSONResponseContentType)

	// v1 Routes define
	router.HandleFunc("/file/{path}", LoadsFile).Methods("GET")

	// Server Listen
	fmt.Println("Listening on http://localhost:5011")
	log.Fatal(http.ListenAndServe("127.0.0.1:5011", router))
}
