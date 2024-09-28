import moment from "moment-timezone";
import cron from "node-cron";
import { ITask } from "../models/task";
import notificationQueue from "./notification-queue";

const scheduleTask = (task: ITask) => {
  const {
    _id,
    next_occurrence: nextOccurrence,
    recurrence: { cron_expression: cronExpression },
    timezone,
  } = task;

  const job = cron.schedule(cronExpression, () => {
    const nextRun = moment().tz(timezone).format();
    console.log(`Task ${_id} is triggered at ${nextRun}`);

    const notifyTime = moment(nextOccurrence).subtract(10, "minutes").toDate();
    notificationQueue.add(
      {
        taskId: _id,
        message: "Task is about to start",
      },
      {
        delay: notifyTime.getTime() - Date.now(),
      }
    );
  });

  job.start();
};

export default scheduleTask;
