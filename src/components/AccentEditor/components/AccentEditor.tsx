import { useState } from 'react';

import { useI18n } from '../../../i18n';
import { useAccentAnalysis } from '../hooks/useAccentAnalysis';
import { useHistoryKeyboardShortcuts } from '../hooks/useHistoryKeyboardShortcuts';
import { useResultReveal } from '../hooks/useResultReveal';
import { useSyncedPanelHeight } from '../hooks/useSyncedPanelHeight';
import { useWordHistory } from '../hooks/useWordHistory';

import Input from './Input';
import Result from './Result';

import './AccentEditor.css';

export default function AccentEditor() {
    const { t } = useI18n();
    const [paragraph, setParagraph] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { minHeight, panelRef } = useSyncedPanelHeight<HTMLElement>();
    const {
        redoWords,
        replaceVersion,
        replaceWords,
        undoWords,
        updateWords,
        words,
    } = useWordHistory();
    const { isLoading, statusMessage } = useAccentAnalysis({
        isEditing,
        paragraph,
        replaceWords,
    });
    const {
        accentPhaseActive,
        isPresenting,
        revealedAccentUnits,
        revealedFuriganaUnits,
        revealedLoadingCharacters,
    } = useResultReveal({
        analysisVersion: replaceVersion,
        isLoading,
        paragraph,
        words,
    });
    const isBusy = isLoading || isPresenting;

    useHistoryKeyboardShortcuts({
        onRedo: redoWords,
        onUndo: undoWords,
    });

    return (
        <main id='main-content' className='main-content'>
            <h1 className='visually-hidden'>{t.heading}</h1>
            <p className='visually-hidden' aria-live='polite'>
                {statusMessage}
            </p>
            <div className='two-col-layout' aria-label={t.resultsAndInput}>
                <section className='input-panel' aria-label={t.inputPanelLabel} ref={panelRef}>
                    <Input paragraph={paragraph} setParagraph={setParagraph} isLoading={isLoading} />
                </section>

                <div className='result-panel-stack' style={{ minHeight: `${minHeight}px` }}>
                    <section className='result-panel' aria-label={t.resultPanelLabel} aria-busy={isBusy}>
                        <Result
                            accentPhaseActive={accentPhaseActive}
                            isPresenting={isPresenting}
                            paragraph={paragraph}
                            revealedAccentUnits={revealedAccentUnits}
                            revealedFuriganaUnits={revealedFuriganaUnits}
                            revealedLoadingCharacters={revealedLoadingCharacters}
                            words={words}
                            updateWords={updateWords}
                            isLoading={isLoading}
                            onEditingChange={setIsEditing}
                            statusMessage={statusMessage}
                        />
                    </section>
                    {words.length > 0 && (
                        <p className='result-panel-hint' aria-hidden='true'>
                            {t.resultHint}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
