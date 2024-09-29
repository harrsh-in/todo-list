import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { scheduleRecurringCronJob } from '../../jobs/task-scheduler';
import { prisma } from '../../libs/prisma';
import { convertToUTC } from '../../utils';
import logger from '../../utils/logger';
import addTaskCreationEntry from './add-task-creation-entry';
import { CreateTaskRequestBody } from './requests';
import { scheduleNotificationJob } from '../../jobs/notification-scheduler';

const createTaskController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.cookies['userId'] as string;

        const {
            title,
            description,
            timezone,
            dateTime,
            recurrenceType,
            recurrenceRule,
            notifications,
        } = req.body as CreateTaskRequestBody;

        const notificationTime = [
            ...notifications,
            {
                value: 0,
                unit: 'minutes',
            },
        ];

        const utcDateTime = convertToUTC({
            dateTime,
            timezone,
        });

        const cronExpression =
            recurrenceRule ||
            (recurrenceType
                ? generateCronExpression(recurrenceType, utcDateTime)
                : undefined);

        const task = await prisma.task.create({
            data: {
                title,
                description,
                timezone,
                user_id: userId,
                recurrence_type: recurrenceType,
                recurrence_rule: cronExpression,
            },
        });

        logger.info('Scheduling task job...');

        if (recurrenceType && cronExpression) {
            // Handle recurring tasks
            await scheduleRecurringCronJob({
                task: {
                    id: task.id,
                    title: task.title,
                    userId: task.user_id,
                },
                cronExpression,
                taskDateTime: utcDateTime,
                notificationTime,
            });
        } else {
            // Handle non-recurring tasks
            await addTaskCreationEntry({
                taskId: task.id,
                userId,
                taskDateTime: utcDateTime,
                notificationTime,
            });

            await scheduleNotificationJob({
                taskId: task.id,
                taskDateTime: utcDateTime,
                notificationTime,
            });
        }

        return res.success({}, 'The task is created successfully...');
    } catch (error) {
        next(error);
    }
};

export default createTaskController;

const generateCronExpression = (recurrenceType: string, date: Date): string => {
    const dayjsDate = dayjs.utc(date);

    const minute = dayjsDate.minute();
    const hour = dayjsDate.hour();
    const dayOfMonth = dayjsDate.date();
    const month = dayjsDate.month() + 1;
    const dayOfWeek = dayjsDate.day();

    switch (recurrenceType) {
        case 'DAILY':
            return `${minute} ${hour} * * *`;
        case 'WEEKLY':
            return `${minute} ${hour} * * ${dayOfWeek}`;
        case 'MONTHLY':
            return `${minute} ${hour} ${dayOfMonth} * *`;
        case 'YEARLY':
            return `${minute} ${hour} ${dayOfMonth} ${month} *`;
        default:
            throw new Error('Invalid recurrence type');
    }
};
