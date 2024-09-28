import { Router } from "express";
import createTaskController from "./controllers/task/create-task.controller";
import requestValidator from "./middlewares/request-validator";
import { taskValidationSchema } from "./schema/task-validation-schema";

const router = Router();

router.post(
  "/create-task",
  requestValidator({
    body: taskValidationSchema,
  }),
  createTaskController
);

export default router;
