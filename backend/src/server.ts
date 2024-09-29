import dayjs from 'dayjs';
import http from 'http';
import app from './app';
import { nodeEnv, port } from './env';
import { prisma } from './libs/prisma';
import { redis } from './libs/redis';
import { socket } from './libs/socket';
import logger from './utils/logger';

const server = http.createServer(app);

socket.init(server);

server.listen(port, () => {
    logger.info(`Server is running on port ${port}...`);
    logger.info(`Current time is ${dayjs().format()}`);
    logger.info(`Current timezone is ${dayjs.tz.guess()}`);
    logger.info(`Current environment is ${nodeEnv}`);
});

const shutdown = async (signal: string) => {
    logger.info(`Received signal ${signal}. Shutting down...`);

    try {
        await socket.close();

        if (server.listening) {
            server.close((err) => {
                if (err) {
                    console.error('Error shutting down HTTP server', err);
                    process.exit(1);
                }
                logger.info('HTTP server closed...');
            });
        }

        await prisma.$disconnect();
        logger.info('Prisma client disconnected...');

        await redis.quit();
        logger.info('Redis client disconnected...');

        process.exit(0);
    } catch (error) {
        console.error('Error disconnecting services', error);
        process.exit(1);
    }
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => shutdown(signal));
});
