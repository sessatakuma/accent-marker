import { useEffect } from 'react';

interface UseHistoryKeyboardShortcutsOptions {
    onRedo: () => void;
    onUndo: () => void;
}

export function useHistoryKeyboardShortcuts({
    onRedo,
    onUndo,
}: UseHistoryKeyboardShortcutsOptions): void {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent): void => {
            const modifier = event.metaKey || event.ctrlKey;
            if (!modifier) return;

            const key = event.key.toLowerCase();
            if (key === 'z' && !event.shiftKey) {
                event.preventDefault();
                onUndo();
            }

            if (key === 'y' || (key === 'z' && event.shiftKey)) {
                event.preventDefault();
                onRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onRedo, onUndo]);
}
