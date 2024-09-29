import { Worker } from 'bullmq';
import dayjs from 'dayjs';
import { get } from 'lodash';
import addTaskCreationEntry from '../controllers/task/add-task-creation-entry';
import { redis } from '../libs/redis';
import logger from '../utils/logger';
import { scheduleNotificationJob } from './notification-scheduler';

const taskListener = new Worker(
    'taskQueue',
    async (job) => {
        interface ITaskListenerJobData {
            taskId: string;
            userId: string;
            notificationTime: {
                value: number;
                unit: string;
            }[];
        }
        const { taskId, userId, notificationTime } =
            job.data as ITaskListenerJobData;

        const prevMillis = job.opts.prevMillis;
        if (!prevMillis) {
            logger.error('Previous millis not found');
            return;
        }

        await addTaskCreationEntry({
            taskId,
            userId,
            taskDateTime: dayjs(prevMillis).toDate(),
            notificationTime,
        });

        await scheduleNotificationJob({
            taskId,
            taskDateTime: dayjs(prevMillis).toDate(),
            notificationTime,
        });

        return `Task ${taskId} processed successfully`;
    },
    {
        connection: redis,
    }
);

taskListener.on('completed', (job) => {
    logger.info(`Job ${job.id} has been completed.`);
});

taskListener.on('failed', (job, err) => {
    console.error(err);
    logger.info(`Job ${get(job, 'id')} has failed.`);
});

logger.info('Task listener initialized...');

export default taskListener;
