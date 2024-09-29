import IORedis from 'ioredis';
import { redisHost, redisPort } from '../env';
import logger from '../utils/logger';

class RedisInstance {
    private static instance: IORedis;

    private constructor() {}

    public static getInstance(): IORedis {
        if (!RedisInstance.instance) {
            RedisInstance.instance = new IORedis({
                host: redisHost,
                port: redisPort,
                maxRetriesPerRequest: null,
            });
            logger.info('Redis client initialized...');
        }
        return RedisInstance.instance;
    }
}

export const redis = RedisInstance.getInstance();
