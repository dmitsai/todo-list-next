'use client';

import { ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { createContext, PropsWithChildren } from 'react';
import { TodoContext } from '~/shared/lib/context/TodoContext';
import useTodo from '~/shared/lib/hooks/todo';
import theme from '~/styles/theme';

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const todoValue = useTodo();
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <TodoContext.Provider value={todoValue}>
          {children}
        </TodoContext.Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
