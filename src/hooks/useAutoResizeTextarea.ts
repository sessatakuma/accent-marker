import { useEffect, type RefObject } from 'react';

export function useAutoResizeTextarea(
    textareaRef: RefObject<HTMLTextAreaElement | null>,
    value: string,
): void {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [textareaRef, value]);
}
