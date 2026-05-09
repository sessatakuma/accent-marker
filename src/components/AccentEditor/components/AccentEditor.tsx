import { useEffect, useRef, useState } from 'react';

import { useAccentAnalysis } from '../hooks/useAccentAnalysis';
import { useHistoryKeyboardShortcuts } from '../hooks/useHistoryKeyboardShortcuts';
import { useResultReveal } from '../hooks/useResultReveal';
import { useSyncedPanelHeight } from '../hooks/useSyncedPanelHeight';
import { useWordHistory } from '../hooks/useWordHistory';

import Input from './Input';
import Result from './Result';

import './AccentEditor.css';

export default function AccentEditor() {
    const [paragraph, setParagraph] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [hintPhase, setHintPhase] = useState<'hidden' | 'loading' | 'done' | 'edit'>('hidden');
    const doneTimeoutRef = useRef<number | null>(null);
    const previousBusyRef = useRef(false);
    const { minHeight, panelRef } = useSyncedPanelHeight<HTMLElement>();
    const {
        redoWords,
        replaceWords,
        undoWords,
        updateWords,
        words,
    } = useWordHistory();
    const { analysisVersion, isLoading, statusMessage } = useAccentAnalysis({
        isEditing,
        paragraph,
        replaceWords,
    });
    const {
        isPresenting,
        revealedAccentUnits,
        revealedFuriganaUnits,
        revealedLoadingCharacters,
    } = useResultReveal({
        analysisVersion,
        isLoading,
        paragraph,
        words,
    });
    const isBusy = isLoading || isPresenting;

    useEffect(() => {
        if (doneTimeoutRef.current !== null) {
            window.clearTimeout(doneTimeoutRef.current);
            doneTimeoutRef.current = null;
        }

        if (isBusy && paragraph.trim().length > 0) {
            setHintPhase('loading');
            previousBusyRef.current = true;
            return;
        }

        if (!isBusy && previousBusyRef.current && words.length > 0) {
            setHintPhase('done');
            previousBusyRef.current = false;
            doneTimeoutRef.current = window.setTimeout(() => {
                setHintPhase('edit');
                doneTimeoutRef.current = null;
            }, 300);
            return;
        }

        previousBusyRef.current = false;
        setHintPhase(words.length > 0 ? 'edit' : 'hidden');
    }, [isBusy, paragraph, words.length]);

    useEffect(
        () => () => {
            if (doneTimeoutRef.current !== null) {
                window.clearTimeout(doneTimeoutRef.current);
                doneTimeoutRef.current = null;
            }
        },
        [],
    );

    useHistoryKeyboardShortcuts({
        onRedo: redoWords,
        onUndo: undoWords,
    });

    return (
        <main id='main-content' className='main-content'>
            <h1 className='visually-hidden'>日本語アクセントマーカー</h1>
            <p className='visually-hidden' aria-live='polite'>
                {statusMessage}
            </p>
            <div className='two-col-layout' aria-label='入力と解析結果'>
                <section className='input-panel' aria-label='入力' ref={panelRef}>
                    <Input paragraph={paragraph} setParagraph={setParagraph} isLoading={isLoading} />
                </section>

                <div className='result-panel-stack' style={{ minHeight: `${minHeight}px` }}>
                    <section className='result-panel' aria-label='結果' aria-busy={isBusy}>
                        <Result
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
                    {hintPhase !== 'hidden' && (
                        <p
                            className={`result-panel-hint result-panel-hint-${hintPhase}`}
                            aria-hidden='true'
                        >
                            {hintPhase === 'loading' && (
                                <>
                                    <span>分析中</span>
                                    <span className='result-panel-hint-dots'>
                                        <span className='result-panel-hint-dot'></span>
                                        <span className='result-panel-hint-dot'></span>
                                        <span className='result-panel-hint-dot'></span>
                                    </span>
                                </>
                            )}
                            {hintPhase === 'done' && '分析完了！'}
                            {hintPhase === 'edit' && 'ふりがな・アクセントをクリックして編集'}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
