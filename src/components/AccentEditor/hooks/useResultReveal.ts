import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const LOADING_CHARACTER_INTERVAL_MS = 22;
const REVEAL_INTERVAL_MS = 28;
const REVEAL_ACCELERATION_START = 0.55;
const REVEAL_MIN_INTERVAL_MULTIPLIER = 0.18;
const MAX_REVEAL_DURATION_MS = 3200;
const MAX_ANIMATED_REVEAL_UNITS = 320;

function getRevealStepDelay(totalUnits: number, stepIndex: number, baseIntervalMs: number) {
    if (totalUnits <= 1) {
        return baseIntervalMs;
    }

    const progress = stepIndex / totalUnits;
    if (progress <= REVEAL_ACCELERATION_START) {
        return baseIntervalMs;
    }

    const tailProgress =
        (progress - REVEAL_ACCELERATION_START) / (1 - REVEAL_ACCELERATION_START);
    const easedTailProgress = tailProgress * tailProgress;
    const intervalMultiplier =
        1 - (1 - REVEAL_MIN_INTERVAL_MULTIPLIER) * easedTailProgress;

    return Math.max(12, Math.round(baseIntervalMs * intervalMultiplier));
}

function buildRevealSchedule(totalUnits: number, baseIntervalMs: number): number[] {
    if (totalUnits <= 0) {
        return [];
    }

    const cumulativeDurations: number[] = [];
    let elapsedMs = 0;

    for (let index = 1; index <= totalUnits; index += 1) {
        elapsedMs += getRevealStepDelay(totalUnits, index, baseIntervalMs);
        cumulativeDurations.push(elapsedMs);
    }

    if (elapsedMs <= MAX_REVEAL_DURATION_MS) {
        return cumulativeDurations;
    }

    const scale = MAX_REVEAL_DURATION_MS / elapsedMs;
    return cumulativeDurations.map(duration => Math.round(duration * scale));
}

function getRevealTotals(
    words: Array<{
        accent: number | number[];
        furigana: Array<unknown>;
    }>,
) {
    const furiganaUnits = words.reduce((count, word) => count + word.furigana.length, 0);
    const accentUnits = words.reduce((count, word) => {
        if (Array.isArray(word.accent)) {
            return count + word.accent.length;
        }

        return count + word.furigana.length;
    }, 0);

    return { accentUnits, furiganaUnits };
}

interface RevealState {
    analysisVersion: number;
    phase: 'idle' | 'revealing' | 'complete';
    revealedAccentUnits: number;
    revealedFuriganaUnits: number;
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
    words: Array<{
        accent: number | number[];
        furigana: Array<unknown>;
    }>;
}) {
    const animatedAnalysisVersionRef = useRef(analysisVersion);
    const [revealedLoadingCharacters, setRevealedLoadingCharacters] = useState(0);
    const [revealState, setRevealState] = useState<RevealState>({
        analysisVersion,
        phase: 'idle',
        revealedAccentUnits: 0,
        revealedFuriganaUnits: 0,
    });
    const { accentUnits, furiganaUnits } = getRevealTotals(words);
    const revealUnits = Math.max(furiganaUnits, accentUnits);
    const shouldSkipAnimatedReveal = revealUnits > MAX_ANIMATED_REVEAL_UNITS;
    const isStaleRevealState =
        !isLoading && words.length > 0 && revealState.analysisVersion !== analysisVersion;

    useEffect(() => {
        if (paragraph.trim() === '') {
            setRevealedLoadingCharacters(0);
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

    useLayoutEffect(() => {
        if (isLoading || words.length === 0) {
            return;
        }

        if (analysisVersion === revealState.analysisVersion) {
            return;
        }

        if (furiganaUnits === 0 && accentUnits === 0) {
            return;
        }

        if (shouldSkipAnimatedReveal) {
            setRevealState({
                analysisVersion,
                phase: 'complete',
                revealedAccentUnits: accentUnits,
                revealedFuriganaUnits: furiganaUnits,
            });
            return;
        }

        setRevealState({
            analysisVersion,
            phase: 'revealing',
            revealedAccentUnits: 0,
            revealedFuriganaUnits: 0,
        });
    }, [
        accentUnits,
        analysisVersion,
        furiganaUnits,
        isLoading,
        revealState.analysisVersion,
        shouldSkipAnimatedReveal,
        words.length,
    ]);

    useEffect(() => {
        if (isLoading || words.length === 0) {
            if (!isLoading && words.length === 0) {
                setRevealState(currentState => ({
                    ...currentState,
                    phase: 'idle',
                    revealedAccentUnits: 0,
                    revealedFuriganaUnits: 0,
                }));
            }
            return;
        }

        if (furiganaUnits === 0 && accentUnits === 0) {
            setRevealState(currentState => ({
                ...currentState,
                phase: 'idle',
                revealedAccentUnits: 0,
                revealedFuriganaUnits: 0,
            }));
            return;
        }

        if (shouldSkipAnimatedReveal) {
            animatedAnalysisVersionRef.current = analysisVersion;
            setRevealState({
                analysisVersion,
                phase: 'complete',
                revealedAccentUnits: accentUnits,
                revealedFuriganaUnits: furiganaUnits,
            });
            return;
        }

        if (analysisVersion === animatedAnalysisVersionRef.current) {
            return;
        }

        animatedAnalysisVersionRef.current = analysisVersion;
        setRevealState(currentState =>
            currentState.analysisVersion !== analysisVersion
                ? currentState
                : {
                      ...currentState,
                      phase: 'revealing',
                      revealedAccentUnits: 0,
                      revealedFuriganaUnits: 0,
                  },
        );

        const revealSchedule = buildRevealSchedule(revealUnits, REVEAL_INTERVAL_MS);

        if (revealSchedule.length === 0) {
            setRevealState(currentState =>
                currentState.analysisVersion !== analysisVersion
                    ? currentState
                    : {
                          ...currentState,
                          phase: 'complete',
                          revealedAccentUnits: accentUnits,
                          revealedFuriganaUnits: furiganaUnits,
                      },
            );
            return;
        }

        let frameId = 0;
        let revealedUnits = 0;
        let animationStartMs: number | null = null;

        const tick = (timestampMs: number): void => {
            if (animationStartMs === null) {
                animationStartMs = timestampMs;
            }

            const elapsedMs = timestampMs - animationStartMs;

            while (
                revealedUnits < revealSchedule.length &&
                elapsedMs >= revealSchedule[revealedUnits]
            ) {
                revealedUnits += 1;
            }

            setRevealState(currentState =>
                currentState.analysisVersion !== analysisVersion
                    ? currentState
                    : {
                          ...currentState,
                          phase: revealedUnits >= revealUnits ? 'complete' : 'revealing',
                          revealedAccentUnits: Math.min(revealedUnits, accentUnits),
                          revealedFuriganaUnits: Math.min(revealedUnits, furiganaUnits),
                      },
            );

            if (revealedUnits < revealUnits) {
                frameId = window.requestAnimationFrame(tick);
            }
        };

        frameId = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frameId);
    }, [
        accentUnits,
        analysisVersion,
        furiganaUnits,
        isLoading,
        revealUnits,
        shouldSkipAnimatedReveal,
        words.length,
    ]);

    useEffect(() => {
        if (isLoading || revealState.phase === 'revealing') {
            return;
        }

        setRevealState(currentState => {
            if (
                currentState.analysisVersion !== analysisVersion ||
                (currentState.revealedAccentUnits === accentUnits &&
                    currentState.revealedFuriganaUnits === furiganaUnits)
            ) {
                return currentState;
            }

            return {
                ...currentState,
                revealedAccentUnits: accentUnits,
                revealedFuriganaUnits: furiganaUnits,
            };
        });
    }, [accentUnits, analysisVersion, furiganaUnits, isLoading, revealState.phase]);

    const revealPhase = isStaleRevealState ? 'revealing' : revealState.phase;

    return {
        accentPhaseActive: revealPhase === 'revealing' || revealPhase === 'complete',
        isPresenting: revealPhase === 'revealing',
        revealedAccentUnits: isStaleRevealState ? 0 : revealState.revealedAccentUnits,
        revealedFuriganaUnits: isStaleRevealState ? 0 : revealState.revealedFuriganaUnits,
        revealedLoadingCharacters,
    };
}
