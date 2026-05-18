import { useEffect, useRef, useState } from 'react';

const MIN_PANEL_HEIGHT = 500;

export function useSyncedPanelHeight<T extends HTMLElement>() {
    const panelRef = useRef<T>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [minHeight, setMinHeight] = useState(MIN_PANEL_HEIGHT);

    useEffect(() => {
        const panel = panelRef.current;
        const footer = footerRef.current;
        const textarea = panel?.querySelector('textarea');
        if (!panel || !footer || !textarea) return;

        const syncHeight = (): void => {
            const textareaHeight = textarea.getBoundingClientRect().height;
            const footerHeight = footer.getBoundingClientRect().height;

            setMinHeight(Math.max(MIN_PANEL_HEIGHT, Math.ceil(textareaHeight + footerHeight)));
        };

        syncHeight();

        const observer = new ResizeObserver(() => {
            syncHeight();
        });

        observer.observe(textarea);
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    return {
        footerRef,
        minHeight,
        panelRef,
    };
}
