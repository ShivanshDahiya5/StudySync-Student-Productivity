import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed = JSON.parse(raw);
      return parsed ?? initialValue;
    } catch (err) {
