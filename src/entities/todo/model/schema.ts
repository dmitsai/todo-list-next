import z from 'zod';

export const createTodoSchema = z
  .string()
  .trim()
  .min(1, { message: 'Невозможно создать пустое задание' });

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;

export const updateTodoTaskSchema = z
  .string()
  .trim()
  .min(1, { message: 'Невозможно изменить на пустое задание' });

export type UpdateTodoTaskSchema = z.infer<typeof updateTodoTaskSchema>;
