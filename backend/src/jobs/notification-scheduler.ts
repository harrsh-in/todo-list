import { Queue } from 'bullmq';
import dayjs, { ManipulateType } from 'dayjs';
import { redis } from '../libs/redis';
import logger from '../utils/logger';

export const notificationQueue = new Queue('notificationQueue', {
    connection: redis,
});

export const scheduleNotificationJob = async ({
    taskId,
    taskDateTime,
    notificationTime,
}: {
    taskId: string;
    taskDateTime: Date;
    notificationTime: {
        value: number;
        unit: string;
    }[];
}) => {
    const now = dayjs();
    const taskDate = dayjs(taskDateTime);

    if (taskDate.isBefore(now)) {
        logger.info(
            `Task ${taskId} is already in the past (Scheduled for ${taskDateTime}). Skipping notification scheduling.`
        );
        return;
    }

    for (const { unit, value } of notificationTime) {
        const notificationDateTime = taskDate.subtract(
            value,
            unit as ManipulateType
        );

        if (notificationDateTime.isBefore(now)) {
            logger.info(
                `Notification ${value} ${unit} for task ${taskId} at ${notificationDateTime.format()} is already in the past. Skipping.`
            );
            continue;
        }

        logger.info(
            `Scheduling notification ${value} ${unit} for task ${taskId} at ${notificationDateTime.format()}.`
        );
        const jobId = `${taskId}-${notificationDateTime.valueOf()}`;

        try {
            await notificationQueue.add(
                `${jobId}-notification`,
                {
                    taskId,
                    message: `Notification is scheduled for task ${taskId} at ${notificationDateTime.format()}.`,
                },
                {
                    jobId,
                    delay: notificationDateTime.diff(now, 'millisecond'),
                    attempts: 3,
                }
            );
        } catch (error) {
            console.error(error);
            logger.error(
                `Failed to schedule notification ${value} ${unit} for task ${taskId} at ${notificationDateTime.format()}.`
            );
        }
    }
};
