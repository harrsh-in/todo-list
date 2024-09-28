import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import moment, { unitOfTime } from "moment";
import scheduleTask from "../../libs/schedule-task";
import { Task } from "../../models/task";
import { TaskValidationSchemaType } from "../../schema/task-validation-schema";
import { calculateNextOccurrence } from "../../utils";

const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description, endTime, recurrence, startTime, timezone, title } =
      req.body as TaskValidationSchemaType;

    const nextOccurrence = calculateNextOccurrence({
      startTime,
      timezone,
      recurrenceRule:
        recurrence.cron_expression as unknown as unitOfTime.DurationConstructor, // Need to figure out the way to validate it.
    });

    const startTimeUTC = moment.tz(startTime, timezone).utc().toDate();
    const endTimeUTC = moment.tz(endTime, timezone).utc().toDate();

    const task = new Task({
      title,
      description,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
      timezone,
      recurrence,
      next_occurrence: nextOccurrence,
    });
    await task.save();

    scheduleTask(task);

    res.json({
      message: "Task created successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);

    // TODO: Add error message later
    res.status(400).json({
      message: get(error, "message", "Something went wrong"),
    });
  }
};

export default createTaskController;
