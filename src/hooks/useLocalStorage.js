import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const raw = window.localStorage.getItem(key);
            if (raw === null) return initialValue;
            const parsed = JSON.parse(raw);
            return parsed ?? initialValue;
        } catch (err) {
            console.warn(`useLocalStorage: failed to read key "${key}"`, err);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.warn(`useLocalStorage: failed to write key "${key}"`, err);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;