import Queue, { Queue as BullQueue } from "bull";
import Redis from "ioredis";

const redisClient = new Redis({
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});
const notificationQueue: BullQueue = new Queue("notifications", {
  createClient: () => redisClient,
});
export default notificationQueue;

notificationQueue.process(async (job) => {
  console.log(
    `Sending notification for task ID ${job.data.taskId}:${job.data.message}`
  );
  console.log(job.data);
});
