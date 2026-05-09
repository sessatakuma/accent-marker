import { useEffect, useRef, useState } from 'react';

import isKana from '../core/kana/isKana';
import { splitKanaSyllables } from '../core/kana/kanaUtils';

import type { Word } from '../core/word/accentTypes';

const LOADING_CHARACTER_INTERVAL_MS = 22;
const SURFACE_REVEAL_INTERVAL_MS = 20;
const FURIGANA_REVEAL_INTERVAL_MS = 64;
const ACCENT_REVEAL_INTERVAL_MS = 52;
const PHASE_GAP_MS = 140;

function getSurfaceUnitCount(words: Word[]) {
    return words.reduce((count, word) => {
        const segmentCount = isKana(word.surface) ? splitKanaSyllables(word.surface).length : [...word.surface].length;
        return count + segmentCount;
    }, 0);
}

function getFuriganaUnitCount(words: Word[]) {
    return words.reduce((count, word) => count + word.furigana.length, 0);
}

function getAccentUnitCount(words: Word[]) {
    return words.reduce((count, word) => {
        if (Array.isArray(word.accent)) {
            return count + word.accent.length;
        }

        return count + word.furigana.length;
    }, 0);
}

export function useResultReveal({
    analysisVersion,
    isLoading,
    paragraph,
    words,
}: {
    analysisVersion: number;
    isLoading: boolean;
    paragraph: string;
    words: Word[];
}) {
    const latestWordsRef = useRef(words);
    const [revealedLoadingCharacters, setRevealedLoadingCharacters] = useState(0);
    const [revealedSurfaceUnits, setRevealedSurfaceUnits] = useState(0);
    const [revealedFuriganaUnits, setRevealedFuriganaUnits] = useState(0);
    const [revealedAccentUnits, setRevealedAccentUnits] = useState(0);
    const [isPresenting, setIsPresenting] = useState(false);

    useEffect(() => {
        latestWordsRef.current = words;
    }, [words]);

    useEffect(() => {
        if (paragraph.trim() === '') {
            setRevealedLoadingCharacters(0);
            setRevealedSurfaceUnits(0);
            setRevealedFuriganaUnits(0);
            setRevealedAccentUnits(0);
            setIsPresenting(false);
            return;
        }

        if (!isLoading) {
            return;
        }

        const characters = [...paragraph].filter(character => !/\s/.test(character));
        if (characters.length === 0) {
            setRevealedLoadingCharacters(0);
            return;
        }

        setRevealedLoadingCharacters(0);

        const intervalId = window.setInterval(() => {
            setRevealedLoadingCharacters(currentCount => {
                if (currentCount >= characters.length) {
                    window.clearInterval(intervalId);
                    return currentCount;
                }

                return currentCount + 1;
            });
        }, LOADING_CHARACTER_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [isLoading, paragraph]);

    useEffect(() => {
        const latestWords = latestWordsRef.current;

        if (isLoading || latestWords.length === 0) {
            if (!isLoading && latestWords.length === 0) {
                setRevealedSurfaceUnits(0);
                setRevealedFuriganaUnits(0);
                setRevealedAccentUnits(0);
                setIsPresenting(false);
            }
            return;
        }

        const surfaceUnits = getSurfaceUnitCount(latestWords);
        const furiganaUnits = getFuriganaUnitCount(latestWords);
        const accentUnits = getAccentUnitCount(latestWords);

        setIsPresenting(true);
        setRevealedSurfaceUnits(currentCount => Math.min(currentCount, surfaceUnits));
        setRevealedFuriganaUnits(0);
        setRevealedAccentUnits(0);

        const timeoutIds: number[] = [];
        const initialSurfaceCount = Math.min(revealedLoadingCharacters, surfaceUnits);
        let elapsedMs = 0;

        setRevealedSurfaceUnits(initialSurfaceCount);

        for (let index = initialSurfaceCount + 1; index <= surfaceUnits; index += 1) {
            elapsedMs += SURFACE_REVEAL_INTERVAL_MS;
            timeoutIds.push(window.setTimeout(() => setRevealedSurfaceUnits(index), elapsedMs));
        }

        if (furiganaUnits > 0 || accentUnits > 0) {
            elapsedMs += PHASE_GAP_MS;
        }

        for (let index = 1; index <= furiganaUnits; index += 1) {
            elapsedMs += FURIGANA_REVEAL_INTERVAL_MS;
            timeoutIds.push(window.setTimeout(() => setRevealedFuriganaUnits(index), elapsedMs));
        }

        if (accentUnits > 0) {
            elapsedMs += PHASE_GAP_MS / 2;
        }

        for (let index = 1; index <= accentUnits; index += 1) {
            elapsedMs += ACCENT_REVEAL_INTERVAL_MS;
            timeoutIds.push(window.setTimeout(() => setRevealedAccentUnits(index), elapsedMs));
        }

        timeoutIds.push(
            window.setTimeout(() => {
                setIsPresenting(false);
                setRevealedSurfaceUnits(surfaceUnits);
                setRevealedFuriganaUnits(furiganaUnits);
                setRevealedAccentUnits(accentUnits);
            }, elapsedMs + PHASE_GAP_MS),
        );

        return () => timeoutIds.forEach(timeoutId => window.clearTimeout(timeoutId));
    }, [analysisVersion, isLoading, revealedLoadingCharacters]);

    return {
        isPresenting,
        revealedAccentUnits,
        revealedFuriganaUnits,
        revealedLoadingCharacters,
        revealedSurfaceUnits,
    };
}
