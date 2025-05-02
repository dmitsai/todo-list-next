'use client';

import {
  Box,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TodoCard } from '~/features/todoCard';
import { useTodoContext } from '~/shared/lib/context/TodoContext';
import SortByNewestIcon from '@mui/icons-material/ArrowDownward';
import SortByOldestIcon from '@mui/icons-material/ArrowUpward';
import EmptyIcon from '@mui/icons-material/Inbox';
import theme from '~/styles/theme';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TabLabel, tabLabel, SortOrder } from '../model/types';

export const TodoList = () => {
  const { todos } = useTodoContext();

  const [selectedTab, SetSelectedTab] = useState<TabLabel>(tabLabel.ALL);

  const [sortBy, setSortBy] = useState<SortOrder>('newest');

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (todos.length > 0) {
      setIsInitialLoad(false);
    }
  }, [todos]);

  const total = useMemo(() => todos.length, [todos]);

  const filteredAndSortedTodos = useMemo(() => {
    if (isInitialLoad) return [...todos];
    let filteredTodos = [...todos];

    if (selectedTab === tabLabel.OPEN) {
      filteredTodos = todos.filter((todo) => todo.status === 'OPEN');
    } else if (selectedTab === tabLabel.DONE) {
      filteredTodos = todos.filter((todo) => todo.status === 'DONE');
    }

    return filteredTodos.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [todos, selectedTab, sortBy]);

  const handleChange = (_event: React.SyntheticEvent, selected: TabLabel) => {
    SetSelectedTab(selected);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const CARD_HEIGHT = 180;
  const CARD_GAP = 40;

  const rowVirtualizer = useVirtualizer({
    count: filteredAndSortedTodos.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => CARD_HEIGHT + CARD_GAP,
    overscan: 4,
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    rowVirtualizer.scrollToIndex(0);
  }, [selectedTab, sortBy]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          alignSelf: 'flex-start',
          width: '100%',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {Object.entries(tabLabel).map(([key, label]) => (
            <Tab
              value={label}
              id={`tab-${key}`}
              key={`tab-${key}`}
              label={label === 'Все' ? `${label} (${total})` : label}
              aria-controls={`tabpanel-${key}`}
            />
          ))}
        </Tabs>
      </Box>
      <ToggleButtonGroup
        value={sortBy}
        exclusive
        onChange={(_, newOrder) => newOrder && setSortBy(newOrder)}
        aria-label={'Сортировка по дате'}
        sx={{
          alignSelf: 'flex-start',
        }}
      >
        <ToggleButton size={'small'} value={'newest'} sx={{ px: 2, gap: 1 }}>
          <SortByNewestIcon fontSize="small" />
          <Typography variant={'caption'}>{'Сначало новые'}</Typography>
        </ToggleButton>
        <ToggleButton size={'small'} value={'oldest'} sx={{ px: 2, gap: 1 }}>
          <SortByOldestIcon fontSize="small" />
          <Typography variant={'caption'}>{'Сначало старые'}</Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      {filteredAndSortedTodos.length === 0 ? (
        <Box
          sx={{
            width: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}
        >
          <EmptyIcon sx={{ fontSize: 64 }} />
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
              {'Здесь пока пусто'}
            </Typography>

            <Typography
              sx={{ fontSize: 14, color: theme.palette.text.secondary }}
            >
              {'Вы можете добавить задачу с помощью формы выше'}
            </Typography>
          </Box>
        </Box>
      ) : (
        <div
          ref={containerRef}
          style={{
            height: 'var(--list-container)',
            overflow: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const todo = filteredAndSortedTodos[virtualRow.index];
              return (
                <Box
                  key={todo.id}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TodoCard todo={todo} />
                </Box>
              );
            })}
          </div>
        </div>
      )}
    </Box>
  );
};
