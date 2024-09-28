import moment from "moment";
import { z } from "zod";

export const taskValidationSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required.")
      .max(50, "Title is too long."),
    description: z.string().min(1, "Description is required."),
    startTime: z.string().refine((value) => moment(value).isValid(), {
      message: "Invalid start time.",
    }),
    endTime: z.string().refine((value) => moment(value).isValid(), {
      message: "Invalid end time.",
    }),
    timezone: z.string().min(1, "Timezone is required."),
    recurrence: z.object({
      cron_expression: z.string().min(1, "Cron expression is required."),
    }),
  })
  .superRefine((data, ctx) => {
    if (moment(data.endTime).isBefore(data.startTime)) {
      ctx.addIssue({
        path: ["endTime"],
        message: "End time must be after start time.",
        code: z.ZodIssueCode.custom,
      });
    }
  });
export type TaskValidationSchemaType = z.infer<typeof taskValidationSchema>;
