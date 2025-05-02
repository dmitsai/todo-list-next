'use client';

import { createContext, useContext } from 'react';
import useTodo from '../hooks/todo';

type TodoContextValue = ReturnType<typeof useTodo>;

export const TodoContext = createContext<TodoContextValue | null>(null);

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('Use inside TodoContext.Provider!');
  return context;
};
