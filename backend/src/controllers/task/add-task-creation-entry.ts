import HttpError from '../../libs/HttpError';
import { prisma } from '../../libs/prisma';

const addTaskCreationEntry = async ({
    taskId,
    userId,
    taskDateTime,
    notificationTime,
}: IAddTaskExecutionEntry) => {
    try {
        const existingTask = await prisma.task.findUnique({
            where: {
                id: taskId,
                user_id: userId,
            },
        });
        if (!existingTask) {
            throw new HttpError('Task not found');
        }

        const taskCreationEntryData = await prisma.task_execution.create({
            data: {
                task_id: taskId,
                task_time: taskDateTime,
                task_execution_reminders: {
                    create: notificationTime.map((notification) => ({
                        value: notification.value,
                        unit: notification.unit,
                    })),
                },
            },
            select: {
                id: true,
            },
        });

        return taskCreationEntryData.id;
    } catch (error) {
        console.error(error);
        throw new HttpError(
            'Something went wrong while adding task execution entry'
        );
    }
};

export default addTaskCreationEntry;

interface IAddTaskExecutionEntry {
    taskId: string;
    userId: string;
    taskDateTime: Date;
    notificationTime: {
        value: number;
        unit: string;
    }[];
}
