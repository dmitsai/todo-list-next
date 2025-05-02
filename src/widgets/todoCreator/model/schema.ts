import { z } from 'zod';
import { createTodoSchema } from '~/entities/todo';

export const creatorFormSchema = z.object({
  creator: createTodoSchema,
});

export type CreatorFormSchema = z.infer<typeof creatorFormSchema>;
