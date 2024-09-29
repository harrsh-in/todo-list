import pino from 'pino';
import { nodeEnv } from '../env';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    level: nodeEnv === 'production' ? 'info' : 'debug',
});

export default logger;
