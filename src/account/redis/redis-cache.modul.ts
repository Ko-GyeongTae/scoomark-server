import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

const cacheModule = CacheModule.registerAsync({
    useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 0,
    }),
});

@Module({
    imports: [cacheModule],
    exports: [cacheModule],
})
export class RedisCacheModule { }