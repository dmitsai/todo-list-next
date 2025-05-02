import z from 'zod';
import { updateTodoTaskSchema } from '~/entities/todo';

export const todoCardFormSchema = z.object({
  status: z.boolean(),
  task: updateTodoTaskSchema,
});

export type TodoCardFormSchema = z.infer<typeof todoCardFormSchema>;
