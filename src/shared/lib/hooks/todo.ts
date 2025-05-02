'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { getLocalState, setLocalState } from '../utils/localStorage';
import { Todo } from '../types/todo';
import { Status } from '../types/status';

export const LOCAL_STORAGE_TODOS_KEY = 'todos-key';

const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = getLocalState<Todo[]>(LOCAL_STORAGE_TODOS_KEY);
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const setTodosWithDebounce = useCallback(
    (newState: Todo[] | ((prev: Todo[]) => Todo[])) => {
      setTodos((prev) => {
        const actualNewState =
          typeof newState === 'function' ? newState(prev) : newState;

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          try {
            setLocalState(actualNewState, LOCAL_STORAGE_TODOS_KEY);
          } catch (err) {
            console.error('Failed to save todos', err);
          }
        }, 300);
        return actualNewState;
      });
    },
    []
  );

  const create = (createdTodo: Todo) => {
    setTodosWithDebounce((prev) => [createdTodo, ...prev]);
  };

  const remove = (id: string) => {
    setTodosWithDebounce((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTask = (id: string, updatedTask: string) => {
    setTodosWithDebounce((prev) =>
      prev.map((todo) =>
        todo.id !== id ? todo : { ...todo, task: updatedTask }
      )
    );
  };

  const updateStatus = (id: string, updatedStatus: Status) => {
    setTodosWithDebounce((prev) =>
      prev.map((todo) =>
        todo.id !== id ? todo : { ...todo, status: updatedStatus }
      )
    );
  };

  return {
    todos,
    create,
    remove,
    updateStatus,
    updateTask,
  };
};

export default useTodo;
