import type { CSSProperties } from 'react';

import { placeholder } from '../constant/placeholder';
import isKana from '../core/kana/isKana';
import { splitKanaSyllables } from '../core/kana/kanaUtils';
import { AccentValue, type AccentValueType, type Word } from '../core/word/accentTypes';

import Kana from './Kana';
import SkeletonLoader from './SkeletonLoader';

function getSurfaceSegments(word: Word): string[] {
    return isKana(word.surface) && Array.isArray(word.accent)
        ? splitKanaSyllables(word.surface)
        : [...word.surface];
}

function getWordLayoutMetrics(baseCount: number, readingCount: number) {
    const rubyScale = 0.6;
    const safeBaseCount = Math.max(baseCount, 1);
    const safeReadingCount = Math.max(readingCount, 1);
    const groupWidthEm = Math.max(baseCount, readingCount * rubyScale, 1);

    return {
        baseSlotWidthEm: groupWidthEm / safeBaseCount,
        groupWidthEm,
        readingSlotWidthEm: groupWidthEm / (safeReadingCount * rubyScale),
    };
}

function createWidthStyle(widthEm: number): CSSProperties {
    return { width: `${widthEm}em` };
}

interface ResultContentProps {
    accentPhaseActive: boolean;
    deleteBackwardAcrossFurigana: (wordIndex: number, textIndex: number, currentText: string) => boolean;
    deleteForwardAcrossFurigana: (wordIndex: number, textIndex: number, currentText: string) => boolean;
    isLoading: boolean;
    isPresenting: boolean;
    moveFocusAcrossFurigana: (wordIndex: number, textIndex: number, direction: 'previous' | 'next') => boolean;
    onEditingChange: (isEditing: boolean) => void;
    paragraph: string;
    registerEditableKana: (wordIndex: number, textIndex: number, node: HTMLSpanElement | null) => void;
    revealedAccentUnits: number;
    revealedFuriganaUnits: number;
    revealedLoadingCharacters: number;
    resultRef: React.RefObject<HTMLParagraphElement | null>;
    showAccent: boolean;
    updateFurigana: (
        wordIndex: number,
        textIndex: number,
        newFurigana: string,
        newAccent: AccentValueType,
    ) => void;
    updateKana: (wordIndex: number, textIndex: number, newAccent: AccentValueType) => void;
    words: Word[];
}

export default function ResultContent({
    accentPhaseActive,
    deleteBackwardAcrossFurigana,
    deleteForwardAcrossFurigana,
    isLoading,
    isPresenting,
    moveFocusAcrossFurigana,
    onEditingChange,
    paragraph,
    registerEditableKana,
    revealedAccentUnits,
    revealedFuriganaUnits,
    revealedLoadingCharacters,
    resultRef,
    showAccent,
    updateFurigana,
    updateKana,
    words,
}: ResultContentProps) {
    if (isLoading) {
        return (
            <SkeletonLoader
                paragraph={paragraph}
                revealedCharacterCount={revealedLoadingCharacters}
            />
        );
    }

    if (words.length === 0) {
        return (
            <div className='empty-state' role='status' aria-live='polite'>
                <p>結果</p>
            </div>
        );
    }

    let furiganaRevealIndex = 0;
    let accentRevealIndex = 0;

    return (
        <div
            id='accent-result-output'
            className={`result-area ${showAccent ? '' : 'result-area-hide-accent'}`.trim()}
            ref={resultRef}
            role='region'
            aria-live='polite'
            aria-label='アクセント解析結果'
            lang='ja'
        >
            {words.map((word, wordIndex) => {
                const surfaceSegments = getSurfaceSegments(word);
                const kanaWord = isKana(word.surface);
                const kanaAccents = Array.isArray(word.accent) ? word.accent : null;
                const readingCount = kanaWord ? surfaceSegments.length : word.furigana.length;
                const { baseSlotWidthEm, groupWidthEm, readingSlotWidthEm } = getWordLayoutMetrics(
                    surfaceSegments.length,
                    readingCount,
                );
                const groupStyle = createWidthStyle(groupWidthEm);
                const baseCellStyle = createWidthStyle(baseSlotWidthEm);
                const readingCellStyle = createWidthStyle(readingSlotWidthEm);

                if (kanaWord && kanaAccents) {
                    return (
                        <span
                            key={`${wordIndex}-${word.surface}`}
                            className='word-group word-group-kana'
                            style={groupStyle}
                        >
                            <span className='word-reading-row'>
                                {surfaceSegments.map((segment, charIndex) => {
                                    const isAccentVisible =
                                        accentPhaseActive && accentRevealIndex < revealedAccentUnits;
                                    accentRevealIndex += 1;

                                    return (
                                        <span
                                            key={`${wordIndex}-${charIndex}`}
                                            className='word-reading-cell'
                                            style={readingCellStyle}
                                        >
                                            <Kana
                                                accentPhaseActive={accentPhaseActive}
                                                text={segment}
                                                ghost
                                                accent={kanaAccents[charIndex] ?? AccentValue.None}
                                                accentVisible={isAccentVisible}
                                                interactive={!isPresenting}
                                                onUpdate={(_ignore, newAccent) =>
                                                    updateKana(wordIndex, charIndex, newAccent)
                                                }
                                            />
                                        </span>
                                    );
                                })}
                            </span>
                            <span className='word-base-row' aria-hidden='true'>
                                {surfaceSegments.map((segment, charIndex) => (
                                    <span
                                        key={`${wordIndex}-${charIndex}`}
                                        className='word-base-cell kana-only-base'
                                        style={baseCellStyle}
                                    >
                                        {segment}
                                    </span>
                                ))}
                            </span>
                        </span>
                    );
                }

                return (
                    <span
                        key={`${wordIndex}-${word.surface}`}
                        className='word-group'
                        style={groupStyle}
                    >
                        <span className='word-reading-row'>
                            <span className='furigana-group'>
                                {word.furigana.map((char, charIndex) => {
                                    const isFuriganaVisible = furiganaRevealIndex < revealedFuriganaUnits;
                                    const isAccentVisible =
                                        accentPhaseActive && accentRevealIndex < revealedAccentUnits;

                                    furiganaRevealIndex += 1;
                                    accentRevealIndex += 1;

                                    return (
                                        <span
                                            key={`${wordIndex}-${charIndex}`}
                                            className='word-reading-cell'
                                            style={readingCellStyle}
                                        >
                                            <Kana
                                                accent={char.accent}
                                                accentPhaseActive={accentPhaseActive}
                                                accentVisible={isAccentVisible}
                                                editable
                                                interactive={!isPresenting}
                                                text={char.text === placeholder ? '' : char.text}
                                                textIndex={charIndex}
                                                textVisible={isFuriganaVisible}
                                                wordIndex={wordIndex}
                                                onBackspaceAtStart={currentText =>
                                                    deleteBackwardAcrossFurigana(wordIndex, charIndex, currentText)
                                                }
                                                onDeleteAtStart={currentText =>
                                                    deleteForwardAcrossFurigana(wordIndex, charIndex, currentText)
                                                }
                                                onArrowAtEdge={direction =>
                                                    moveFocusAcrossFurigana(wordIndex, charIndex, direction)
                                                }
                                                onUpdate={(newText, newAccent) =>
                                                    updateFurigana(wordIndex, charIndex, newText, newAccent)
                                                }
                                                onFocusChange={onEditingChange}
                                                registerTextRef={node =>
                                                    registerEditableKana(wordIndex, charIndex, node)
                                                }
                                            />
                                        </span>
                                    );
                                })}
                            </span>
                        </span>
                        <span className='word-base-row' aria-hidden='true'>
                            {surfaceSegments.map((segment, charIndex) => (
                                <span
                                    key={`${wordIndex}-${charIndex}`}
                                    className='word-base-cell'
                                    style={baseCellStyle}
                                >
                                    {segment}
                                </span>
                            ))}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}
