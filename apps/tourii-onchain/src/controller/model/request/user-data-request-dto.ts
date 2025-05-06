import z from 'zod';

export const userDataSchema = z.object({
    username: z.string(),
    password: z.string(),
});
