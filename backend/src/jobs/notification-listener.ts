import { Worker } from 'bullmq';
import dayjs from 'dayjs';
import { get } from 'lodash';
import addTaskCreationEntry from '../controllers/task/add-task-creation-entry';
import { redis } from '../libs/redis';
import logger from '../utils/logger';

const notificationListener = new Worker(
    'notificationQueue',
    async (job) => {
        interface INotificationListenerJobData {
            taskId: string;
        }
        const { taskId } = job.data as INotificationListenerJobData;

        return `Notification for task ${taskId} processed successfully`;
    },
    {
        connection: redis,
    }
);

notificationListener.on('completed', (job) => {
    logger.info(`Job ${job.id} has been completed.`);
});

notificationListener.on('failed', (job, err) => {
    console.error(err);
    logger.info(`Job ${get(job, 'id')} has failed.`);
});

logger.info('Task listener initialized...');

export default notificationListener;
