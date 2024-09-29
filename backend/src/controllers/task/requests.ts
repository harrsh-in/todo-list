import { RecurrenceType } from '@prisma/client';
import { isValidCron } from 'cron-validator';
import { z } from 'zod';

export const createTaskRequestBody = z.object({
    title: z
        .string({
            message: 'Title is required',
        })
        .min(1, {
            message: 'Title is required',
        }),
    description: z.string().optional().default(''),
    dateTime: z
        .string({
            message: 'Start time is required',
        })
        .refine((value) => !isNaN(Date.parse(value)), {
            message:
                'Invalid start time. Please provide a valid date and time.',
        }),
    timezone: z
        .string({
            message: 'Timezone is required',
        })
        .min(1, {
            message: 'Timezone is required',
        }),
    recurrenceType: z.nativeEnum(RecurrenceType).optional(),
    recurrenceRule: z
        .string()
        .optional()
        .refine((value) => {
            if (value) {
                return isValidCron(value, {
                    seconds: true,
                });
            }

            return true;
        }),
    notifications: z
        .array(
            z.object({
                value: z
                    .number({
                        message: 'Notification value is required',
                    })
                    .min(1, {
                        message: 'Notification value is required',
                    }),
                unit: z
                    .string({
                        message: 'Notification unit is required',
                    })
                    .min(1, {
                        message: 'Notification unit is required',
                    }),
            })
        )
        .optional()
        .default([]),
});
export type CreateTaskRequestBody = z.infer<typeof createTaskRequestBody>;
