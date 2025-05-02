export type SortOrder = 'newest' | 'oldest';

export const tabLabel = {
  ALL: 'Все',
  DONE: 'Выполнено',
  OPEN: 'Не выполнено',
} as const;

export type TabLabel = (typeof tabLabel)[keyof typeof tabLabel];
