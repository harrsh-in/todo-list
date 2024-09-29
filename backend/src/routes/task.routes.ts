import { Router } from 'express';
import createTaskController from '../controllers/task/create-task.controller';
import getTasksListController from '../controllers/task/get-tasks-list.controller';
import { createTaskRequestBody } from '../controllers/task/requests';
import validateRequestMiddleware from '../middlewares/validate-request.middleware';
import { paginationRequest } from '../requests/pagination';

const taskRouter = Router();

taskRouter.get(
    '/list',
    validateRequestMiddleware({
        query: paginationRequest,
    }),
    getTasksListController
);
taskRouter.post(
    '/create',
    validateRequestMiddleware({
        body: createTaskRequestBody,
    }),
    createTaskController
);

export default taskRouter;
