import {
    ArrowDownToLine,
    CodeXml,
    Copy,
    Image as ImageIcon,
    Moon,
    Sun,
} from 'lucide-react';

import { useI18n } from '../../../i18n';

type FeedbackType = 'success' | 'warning';

interface ResultActionsProps {
    copyFeedback: string | null;
    downloadHtml: () => void;
    copyPlainText: () => void;
    downloadImage: () => void;
    feedbackType: FeedbackType;
    isDarkResult: boolean;
    isMenuOpen: boolean;
    setIsDarkResult: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowAccent: React.Dispatch<React.SetStateAction<boolean>>;
    showAccent: boolean;
}

export default function ResultActions({
    copyFeedback,
    copyPlainText,
    downloadHtml,
    downloadImage,
    feedbackType,
    isDarkResult,
    isMenuOpen,
    setIsDarkResult,
    setIsMenuOpen,
    setShowAccent,
    showAccent,
}: ResultActionsProps) {
    const { t } = useI18n();

    return (
        <div className='result-actions' aria-label={t.resultActions}>
            <div className='action-group-left'>
                <label className='accent-toggle' htmlFor='show-accent-toggle'>
                    <span className='accent-toggle-label'>{t.accentToggle}</span>
                    <span className='switch'>
                        <input
                            id='show-accent-toggle'
                            type='checkbox'
                            checked={showAccent}
                            onChange={() => setShowAccent(prev => !prev)}
                            aria-controls='accent-result-output'
                        />
                        <span className='slider'></span>
                    </span>
                </label>
            </div>

            <div className='action-group-right' aria-label={t.saveAndCopy}>
                <div className='copy-action-container'>
                    {copyFeedback && (
                        <div
                            className={`toast-notification toast-${feedbackType}`}
                            role='status'
                            aria-live='polite'
                        >
                            {copyFeedback}
                        </div>
                    )}
                    <button
                        className='action-button'
                        onClick={copyPlainText}
                        title={t.copyAsText}
                        aria-label={t.copyAsText}
                        type='button'
                    >
                        <Copy size={18} />
                    </button>
                </div>

                <div className='save-menu-container'>
                    <button
                        id='save-menu-trigger'
                        className={`action-button save-menu-trigger ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        title={t.exportOptions}
                        aria-label={t.exportOptions}
                        aria-haspopup='menu'
                        aria-expanded={isMenuOpen}
                        aria-controls='save-menu'
                        type='button'
                    >
                        <ArrowDownToLine size={18} />
                    </button>

                    {isMenuOpen && (
                        <div
                            id='save-menu'
                            className='save-menu-dropdown'
                            role='menu'
                            aria-labelledby='save-menu-trigger'
                        >
                            <div className='menu-inline-row'>
                                <button
                                    className='menu-item menu-item-inline'
                                    onClick={() => {
                                        downloadImage();
                                        setIsMenuOpen(false);
                                    }}
                                    role='menuitem'
                                    type='button'
                                >
                                    <ImageIcon size={16} />
                                    <span>{t.exportImage}</span>
                                </button>
                                <button
                                    type='button'
                                    className='theme-pill-button theme-pill-button-single'
                                    onClick={() => setIsDarkResult(prev => !prev)}
                                    aria-pressed={isDarkResult}
                                    aria-label={t.toggleImageTheme(isDarkResult)}
                                    title={t.toggleImageTheme(isDarkResult)}
                                >
                                    {isDarkResult ? <Moon size={18} /> : <Sun size={18} />}
                                </button>
                            </div>
                            <div className='menu-divider'></div>
                            <button
                                className='menu-item'
                                onClick={() => {
                                    downloadHtml();
                                    setIsMenuOpen(false);
                                }}
                                role='menuitem'
                                type='button'
                            >
                                <CodeXml size={16} />
                                <span>{t.exportHtml}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
