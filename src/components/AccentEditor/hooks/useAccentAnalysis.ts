import { useCallback, useEffect, useRef, useState } from 'react';

import useThrottle from '../../../hooks/useThrottle';
import { useI18n } from '../../../i18n';
import { fetchMarkAccent } from '../core/api/markAccentClient';
import { mapApiResultToWords, mapFallbackTextToWords } from '../core/word/accentMappers';

import type { Word } from '../core/word/accentTypes';

const VISIBLE_LOADING_DELAY_MS = 500;

interface UseAccentAnalysisOptions {
    isEditing: boolean;
    paragraph: string;
    replaceWords: (words: Word[]) => void;
}

export function useAccentAnalysis({
    isEditing,
    paragraph,
    replaceWords,
}: UseAccentAnalysisOptions) {
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const throttledParagraph = useThrottle(paragraph, 800);
    const lastAnalyzedParagraphRef = useRef<string | null>(null);
    const activeRequestIdRef = useRef(0);
    const visibleLoadingTimeoutRef = useRef<number | null>(null);

    const clearVisibleLoadingTimeout = useCallback((): void => {
        if (visibleLoadingTimeoutRef.current !== null) {
            window.clearTimeout(visibleLoadingTimeoutRef.current);
            visibleLoadingTimeoutRef.current = null;
        }
    }, []);

    const runAnalysis = useCallback(
        async (text: string): Promise<void> => {
            if (text.trim() === '') {
                activeRequestIdRef.current += 1;
                clearVisibleLoadingTimeout();
                setStatusMessage('');
                setIsLoading(false);
                replaceWords([]);
                return;
            }

            const requestId = activeRequestIdRef.current + 1;
            activeRequestIdRef.current = requestId;
            clearVisibleLoadingTimeout();
            setIsLoading(false);
            visibleLoadingTimeoutRef.current = window.setTimeout(() => {
                if (activeRequestIdRef.current === requestId) {
                    setIsLoading(true);
                }
            }, VISIBLE_LOADING_DELAY_MS);
            const response = await fetchMarkAccent(text);
            if (activeRequestIdRef.current !== requestId) {
                return;
            }

            clearVisibleLoadingTimeout();
            if (!response.ok) {
                replaceWords(mapFallbackTextToWords(text));
                setStatusMessage(t.fallbackStatus);
                setIsLoading(false);
                return;
            }

            replaceWords(mapApiResultToWords(response.result));
            setStatusMessage(t.statusUpdated(response.result.length));

            setIsLoading(false);
        },
        [clearVisibleLoadingTimeout, replaceWords, t],
    );

    useEffect(() => {
        if (isEditing) return;
        if (lastAnalyzedParagraphRef.current === throttledParagraph) return;

        lastAnalyzedParagraphRef.current = throttledParagraph;
        runAnalysis(throttledParagraph);
    }, [isEditing, runAnalysis, throttledParagraph]);

    useEffect(
        () => () => {
            clearVisibleLoadingTimeout();
        },
        [clearVisibleLoadingTimeout],
    );

    return {
        isLoading,
        statusMessage,
    };
}
