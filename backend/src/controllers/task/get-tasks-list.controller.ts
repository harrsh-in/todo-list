import { NextFunction, Request, Response } from 'express';
import logger from '../../utils/logger';
import { PaginationRequest } from '../../requests/pagination';
import { prisma } from '../../libs/prisma';
import { Prisma, RecurrenceType, TaskExecutionStatus } from '@prisma/client';
import HttpError from '../../libs/HttpError';

const getTasksListController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { page, limit, sortBy, sortDirection, query } =
            req.query as unknown as PaginationRequest;
        const userId = req.cookies['userId'] as string;

        switch (sortBy) {
            case 'title':
                sortBy = 'title';
            default:
                sortBy = 'created_at';
        }

        sortDirection = 'desc';

        const getTasksListWhereParameters: Prisma.task_executionWhereInput = {
            task: {
                user_id: userId,
                title: {
                    contains: query,
                },
            },
        };

        const [tasksExecutionListResponseData, tasksExecutionMetaResponseData] =
            await Promise.allSettled([
                prisma.task_execution.findMany({
                    where: getTasksListWhereParameters,
                    select: {
                        id: true,
                        completed_at: true,
                        task_time: true,
                        status: true,
                        task: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                timezone: true,
                                recurrence_type: true,
                                recurrence_rule: true,
                            },
                        },
                    },
                    orderBy: {
                        [sortBy]: sortDirection,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.task_execution.count({
                    where: getTasksListWhereParameters,
                }),
            ]);

        if (tasksExecutionListResponseData.status === 'rejected') {
            throw new HttpError(tasksExecutionListResponseData.reason);
        }
        if (tasksExecutionMetaResponseData.status === 'rejected') {
            throw new HttpError(tasksExecutionMetaResponseData.reason);
        }

        const tasksExecutionList = tasksExecutionListResponseData.value;
        const tasksExecutionMeta = tasksExecutionMetaResponseData.value;

        return res.success(
            {
                tasks: cleanResponse(tasksExecutionList),
                meta: {
                    total: tasksExecutionMeta,
                    page: page,
                    limit: limit,
                    sortBy: sortBy,
                    sortDirection: sortDirection,
                    query: query,
                },
            },
            'The task is created successfully...'
        );
    } catch (error) {
        next(error);
    }
};

export default getTasksListController;

const cleanResponse = (
    tasksExecutionList: {
        status: TaskExecutionStatus;
        id: string;
        task: {
            id: string;
            title: string;
            description: string;
            timezone: string;
            recurrence_type: RecurrenceType | null;
            recurrence_rule: string | null;
        };
        task_time: Date;
        completed_at: Date | null;
    }[]
) => {
    return tasksExecutionList.map((taskExecution) => ({
        id: taskExecution.id,
        status: taskExecution.status,
        taskId: taskExecution.task.id,
        title: taskExecution.task.title,
        description: taskExecution.task.description,
        timezone: taskExecution.task.timezone,
        recurrenceType: taskExecution.task.recurrence_type,
        recurrenceRule: taskExecution.task.recurrence_rule,
        taskTime: taskExecution.task_time,
        completedAt: taskExecution.completed_at,
    }));
};
