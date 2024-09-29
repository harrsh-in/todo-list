import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { corsOrigin } from './env';
import { notificationQueue } from './jobs/notification-scheduler';
import { taskQueue } from './jobs/task-scheduler';
import errorHandlerMiddleware from './middlewares/error.middleware';
import successHandlerMiddleware from './middlewares/response.middleware';
import router from './routes';

import './jobs/notification-listener';
import './jobs/task-listener';

const app = express();

dayjs.extend(utc);
dayjs.extend(timezone);

app.use(
    pinoHttp({
        transport: {
            target: 'pino-pretty',
        },
        serializers: {
            req: (req) => ({
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                remoteAddress: req.remoteAddress,
                remotePort: req.remotePort,
            }),
            res: (res) => ({
                statusCode: res.statusCode,
            }),
            responseTime: (responseTime) => ({
                responseTime: `${responseTime} ms`,
            }),
        },
    })
);

const corsOptions = {
    origin: corsOrigin,
    credentials: true,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(helmet());
app.use(compression());
app.use(cookieParser());

const serverAdapter = new ExpressAdapter();
const bullMqBoardBasePath = '/bull/queues';
serverAdapter.setBasePath(bullMqBoardBasePath);
createBullBoard({
    queues: [
        new BullMQAdapter(taskQueue),
        new BullMQAdapter(notificationQueue),
    ],
    serverAdapter,
});
app.use(bullMqBoardBasePath, serverAdapter.getRouter());

app.use(successHandlerMiddleware);
app.use('/api/v1', router);
app.use(errorHandlerMiddleware);

export default app;
