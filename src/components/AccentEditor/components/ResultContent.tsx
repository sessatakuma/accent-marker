import type { CSSProperties } from 'react';

import { useI18n } from '../../../i18n';
import { AccentValue, type AccentValueType, type Word } from '../core/word/accentTypes';
import { buildWordAnnotationModel, getLineBreakCount, rubyScale } from '../core/word/annotationLayout';

import Kana from './Kana';
import SkeletonLoader from './SkeletonLoader';

function createWidthStyle(widthEm: number): CSSProperties {
    return { width: `${widthEm}em` };
}

function renderPlainSegment(segment: string, key: string) {
    return (
        <span key={key} className='word-stack word-stack-plain'>
            <span className='word-reading-row word-reading-row-empty' aria-hidden='true' />
            <span className='word-base-row'>
                <span className='word-base-cell word-base-cell-plain'>{segment}</span>
            </span>
        </span>
    );
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
    const { lang, t } = useI18n();

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
                <p>{t.result}</p>
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
            aria-label={t.accentResultLabel}
            lang={lang}
        >
            {words.map((word, wordIndex) => {
                const lineBreakCount = getLineBreakCount(word.surface);
                if (lineBreakCount > 0) {
                    return (
                        <span key={`${wordIndex}-${word.surface}`} aria-hidden='true'>
                            {Array.from({ length: lineBreakCount }, (_, breakIndex) => (
                                <br key={`${wordIndex}-break-${breakIndex}`} />
                            ))}
                        </span>
                    );
                }

                const model = buildWordAnnotationModel(word);

                if (model.isKanaWord && model.kanaAccents) {
                    const kanaAccents = model.kanaAccents;

                    return (
                        <span
                            key={`${wordIndex}-${word.surface}`}
                            className='word-inline-cluster word-group-kana'
                            style={createWidthStyle(model.groupWidthEm)}
                        >
                            {model.annotatedReading.map((segment, charIndex) => {
                                const isAccentVisible =
                                    accentPhaseActive && accentRevealIndex < revealedAccentUnits;
                                accentRevealIndex += 1;

                                return (
                                    <span
                                        key={`${wordIndex}-${charIndex}`}
                                        className='word-reading-cell'
                                        style={createWidthStyle(model.baseCellWidthsEm[charIndex])}
                                    >
                                        <Kana
                                            accentPhaseActive={accentPhaseActive}
                                            text={segment}
                                            textVisible
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
                    );
                }

                furiganaRevealIndex += model.annotatedStartIndex;
                accentRevealIndex += model.annotatedStartIndex;

                const mixedWordContent = (
                    <span key={`${wordIndex}-${word.surface}`} className='word-inline-cluster'>
                        {model.prefixSurface.map((segment, segmentIndex) =>
                            renderPlainSegment(segment, `prefix-${wordIndex}-${segmentIndex}`),
                        )}
                        <span className='word-stack word-stack-annotated' style={createWidthStyle(model.groupWidthEm)}>
                            <span className='word-reading-row'>
                                <span className='furigana-group'>
                                    {model.annotatedReading.map((segment, annotatedIndex) => {
                                        const charIndex = model.annotatedStartIndex + annotatedIndex;
                                        const char = word.furigana[charIndex];
                                        const isFuriganaVisible = furiganaRevealIndex < revealedFuriganaUnits;
                                        const isAccentVisible =
                                            accentPhaseActive && accentRevealIndex < revealedAccentUnits;

                                        furiganaRevealIndex += 1;
                                        accentRevealIndex += 1;

                                        return (
                                            <span
                                                key={`${wordIndex}-${charIndex}`}
                                                className='word-reading-cell'
                                                style={createWidthStyle(
                                                    model.readingCellWidthsEm[annotatedIndex] / rubyScale,
                                                )}
                                            >
                                                <Kana
                                                    accent={char.accent}
                                                    accentPhaseActive={accentPhaseActive}
                                                    accentVisible={isAccentVisible}
                                                    editable
                                                    interactive={!isPresenting}
                                                    text={segment}
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
                                {model.annotatedSurface.map((segment, annotatedIndex) => (
                                    <span
                                        key={`${wordIndex}-${annotatedIndex}`}
                                        className='word-base-cell'
                                        style={createWidthStyle(model.baseCellWidthsEm[annotatedIndex])}
                                    >
                                        {segment}
                                    </span>
                                ))}
                            </span>
                        </span>
                        {model.suffixSurface.map((segment, segmentIndex) =>
                            renderPlainSegment(segment, `suffix-${wordIndex}-${segmentIndex}`),
                        )}
                    </span>
                );

                furiganaRevealIndex += model.trailingHiddenReadingCount;
                accentRevealIndex += model.trailingHiddenReadingCount;

                return mixedWordContent;
            })}
        </div>
    );
}
