'use client';

export const getLocalState: <T>(key: string) => T | undefined = (key) => {
  try {
    if (typeof window !== 'undefined') {
      const state = localStorage.getItem(key);
      return state === null ? undefined : JSON.parse(state);
    }
  } catch (err) {
    console.error('Error loading state from localStorage', err);
    return undefined;
  }
};
export const setLocalState: <T>(state: T, key: string) => void = (
  state,
  key
) => {
  const current = getLocalState<typeof state>(key);
  if (typeof window !== 'undefined') {
    if (JSON.stringify(current) !== JSON.stringify(state)) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }
};
