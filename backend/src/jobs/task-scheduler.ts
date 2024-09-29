import async from 'async';
import { Queue } from 'bullmq';
import cronParser from 'cron-parser';
import dayjs from 'dayjs';
import addTaskCreationEntry from '../controllers/task/add-task-creation-entry';
import { redis } from '../libs/redis';
import logger from '../utils/logger';
import { scheduleNotificationJob } from './notification-scheduler';

export const taskQueue = new Queue('taskQueue', {
    connection: redis,
});

export const scheduleRecurringCronJob = async ({
    task,
    cronExpression,
    taskDateTime,
    notificationTime,
}: {
    task: {
        id: string;
        title: string;
        userId: string;
    };
    cronExpression: string;
    taskDateTime: Date;
    notificationTime: {
        value: number;
        unit: string;
    }[];
}) => {
    const { id, title, userId } = task;

    let nextExecutionTime = dayjs(taskDateTime);
    const now = dayjs();

    if (nextExecutionTime.isBefore(now)) {
        const interval = cronParser.parseExpression(cronExpression, {
            currentDate: nextExecutionTime.subtract(1, 'millisecond').toDate(),
            iterator: true,
        });

        const missedOccurrences: dayjs.Dayjs[] = [];
        let breakNext = false;

        while (true) {
            try {
                const nextTime = interval.next().value.toISOString();
                const nextTimeDayjs = dayjs(nextTime);

                if (breakNext) {
                    nextExecutionTime = nextTimeDayjs;
                    break;
                }
                missedOccurrences.push(nextTimeDayjs);

                if (nextTimeDayjs.isAfter(now)) {
                    breakNext = true;
                }
            } catch (error) {
                console.error(error);
                break;
            }
        }

        await new Promise<void>((resolve, reject) => {
            async.mapLimit(
                missedOccurrences,
                50,
                async (
                    missedTime: dayjs.Dayjs,
                    callback: (err?: Error | undefined) => void
                ) => {
                    try {
                        await addTaskCreationEntry({
                            taskId: id,
                            userId,
                            taskDateTime: missedTime.toDate(),
                            notificationTime,
                        });
                        callback();
                    } catch (err) {
                        callback(
                            err instanceof Error ? err : new Error(String(err))
                        );
                    }
                },
                (err) => {
                    if (err) {
                        console.error(
                            'Error occurred while processing missed occurrences:',
                            err
                        );
                        return reject(err);
                    }
                    resolve();
                }
            );
        });

        logger.info(
            `Created entries for missed occurrences. Next valid execution after ${nextExecutionTime.format()}`
        );
    }

    await taskQueue.add(
        title,
        {
            taskId: id,
            userId,
            notificationTime,
            message: `Recurring task ${id} for user ${userId} is scheduled for ${nextExecutionTime.format()}.`,
        },
        {
            jobId: id,
            repeat: {
                pattern: cronExpression,
                startDate: nextExecutionTime
                    .subtract(1, 'millisecond')
                    .toDate(),
            },
            attempts: 3,
        }
    );

    await scheduleNotificationJob({
        taskId: id,
        taskDateTime,
        notificationTime,
    });
};
