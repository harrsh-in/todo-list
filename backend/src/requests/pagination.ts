import { z } from 'zod';

export const paginationRequest = z.object({
    page: z
        .string({
            message: 'Page number must be a number',
        })
        .default('1')
        .refine(
            (value) => {
                const pageNumber = parseInt(value, 10);
                return pageNumber > 0;
            },
            {
                message: 'Page number must be more than 0',
            }
        )
        .transform((value) => parseInt(value, 10)),
    limit: z
        .string({
            message: 'Limit must be a number',
        })
        .default('10')
        .refine(
            (value) => {
                const limit = parseInt(value, 10);
                return limit > 0 && limit <= 100;
            },
            {
                message:
                    'Limit must be more than 0 and less than or equal to 100',
            }
        )
        .transform((value) => parseInt(value, 10)),
    sortBy: z
        .string({
            message: 'Sort by must be a string',
        })
        .default('created_at'),
    sortDirection: z
        .enum(['asc', 'desc'], {
            message: 'Sort direction must be either "asc" or "desc"',
        })
        .default('desc'),
    query: z
        .string({
            message: 'Query must be a string',
        })
        .optional(),
});
export type PaginationRequest = z.infer<typeof paginationRequest>;
