import moment from "moment";
import { z } from "zod";

export const taskValidationSchema = z.object({
  title: z.string().min(1, "Title is required.").max(50, "Title is too long."),
  description: z.string().min(1, "Description is required."),
  startTime: z.string().refine((value) => moment(value).isValid(), {
    message: "Invalid start time.",
  }),
  timezone: z.string().min(1, "Timezone is required."),
  recurrence: z.string().min(1, "Cron expression is required."),
});
export type TaskValidationSchemaType = z.infer<typeof taskValidationSchema>;
