import { useRef } from 'react';

import { type Word } from '../core/word/accentTypes';
import { useResultControls } from '../hooks/useResultControls';
import { useResultEditing } from '../hooks/useResultEditing';

import ResultActions from './ResultActions';
import ResultContent from './ResultContent';

import './Result.css';

interface ResultProps {
    isPresenting: boolean;
    words: Word[];
    paragraph: string;
    revealedAccentUnits: number;
    revealedFuriganaUnits: number;
    revealedLoadingCharacters: number;
    revealedSurfaceUnits: number;
    updateWords: (updater: Word[] | ((current: Word[]) => Word[])) => void;
    isLoading: boolean;
    onEditingChange: (isEditing: boolean) => void;
    statusMessage: string;
}

export default function Result({
    isPresenting,
    paragraph,
    revealedAccentUnits,
    revealedFuriganaUnits,
    revealedLoadingCharacters,
    revealedSurfaceUnits,
    words,
    updateWords,
    isLoading,
    onEditingChange,
    statusMessage,
}: ResultProps) {
    const resultRef = useRef<HTMLParagraphElement>(null);
    const {
        copyFeedback,
        copyPlainText,
        downloadImage,
        downloadMarkdown,
        feedbackType,
        isDarkResult,
        isEmpty,
        isMenuOpen,
        setIsDarkResult,
        setIsMenuOpen,
        setShowAccent,
        showAccent,
        showFeedback,
    } = useResultControls({
        resultRef,
        words,
    });

    const {
        deleteBackwardAcrossFurigana,
        deleteForwardAcrossFurigana,
        moveFocusAcrossFurigana,
        registerEditableKana,
        updateFurigana,
        updateKana,
    } =
        useResultEditing({
            showFeedback,
            updateWords,
            words,
        });

    return (
        <div
            className={`result-container-inner ${isDarkResult ? 'dark-result' : ''} ${
                isEmpty ? 'tone-down' : ''
            }`}
        >
            <p className='visually-hidden' aria-live='polite'>
                {statusMessage}
            </p>
            <div className='result-content'>
                <ResultContent
                    deleteBackwardAcrossFurigana={deleteBackwardAcrossFurigana}
                    deleteForwardAcrossFurigana={deleteForwardAcrossFurigana}
                    isLoading={isLoading}
                    isPresenting={isPresenting}
                    moveFocusAcrossFurigana={moveFocusAcrossFurigana}
                    onEditingChange={onEditingChange}
                    paragraph={paragraph}
                    registerEditableKana={registerEditableKana}
                    revealedAccentUnits={revealedAccentUnits}
                    revealedFuriganaUnits={revealedFuriganaUnits}
                    revealedLoadingCharacters={revealedLoadingCharacters}
                    revealedSurfaceUnits={revealedSurfaceUnits}
                    resultRef={resultRef}
                    showAccent={showAccent}
                    updateFurigana={updateFurigana}
                    updateKana={updateKana}
                    words={words}
                />
            </div>

            {!isEmpty && !isPresenting && (
                <ResultActions
                    copyFeedback={copyFeedback}
                    copyPlainText={copyPlainText}
                    downloadImage={downloadImage}
                    downloadMarkdown={downloadMarkdown}
                    feedbackType={feedbackType}
                    isDarkResult={isDarkResult}
                    isMenuOpen={isMenuOpen}
                    setIsDarkResult={setIsDarkResult}
                    setIsMenuOpen={setIsMenuOpen}
                    setShowAccent={setShowAccent}
                    showAccent={showAccent}
                />
            )}
        </div>
    );
}
