import * as dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, isOptional?: boolean): string => {
    const value = process.env[key];

    if (!value) {
        if (isOptional) {
            return '';
        }
        throw new Error(`Environment variable ${key} not set`);
    }

    return value;
};

export const nodeEnv = getEnv('NODE_ENV');
export const port = +getEnv('PORT');
export const corsOrigin = getEnv('CORS_ORIGIN');
export const redisHost = getEnv('REDIS_HOST');
export const redisPort = +getEnv('REDIS_PORT');
