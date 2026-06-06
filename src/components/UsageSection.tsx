import { ArrowLeftRight, ArrowUpDown, PencilLine, WandSparkles } from 'lucide-react';

import './UsageSection.css';

import { useI18n } from '../i18n';

export default function UsageSection() {
    const { t } = useI18n();

    return (
        <section className='usage-section' aria-labelledby='usage-heading'>
            <div className='usage-section-inner'>
                <div className='usage-section-grid'>
                    <div className='usage-section-copy'>
                        <p className='usage-section-eyebrow'>{t.usageEyebrow}</p>
                        <h2 id='usage-heading'>{t.usageHeading}</h2>
                        <p>{t.usageIntro}</p>
                    </div>
                    <ol className='usage-section-summary'>
                        <li>{t.usageStepOne}</li>
                        <li>{t.usageStepTwo}</li>
                        <li>{t.usageStepThree}</li>
                    </ol>
                </div>
                <div className='usage-guide' aria-label={t.usageHeading}>
                    <article className='usage-guide-card'>
                        <div className='usage-guide-preview usage-guide-preview-start' aria-hidden='true'>
                            <span className='usage-guide-chip'>
                                <WandSparkles size={16} />
                                <span>{t.usageStepStartHint}</span>
                            </span>
                            <div className='usage-guide-textarea'>
                                <span className='usage-guide-line usage-guide-line-strong' />
                                <span className='usage-guide-line' />
                                <span className='usage-guide-line usage-guide-line-short' />
                            </div>
                        </div>
                        <div className='usage-guide-copy'>
                            <h3>{t.usageStepStartTitle}</h3>
                            <p>{t.usageStepStartBody}</p>
                        </div>
                    </article>
                    <article className='usage-guide-card'>
                        <div className='usage-guide-preview usage-guide-preview-furigana' aria-hidden='true'>
                            <span className='usage-guide-chip'>
                                <PencilLine size={16} />
                                <span>{t.usageStepFuriganaHint}</span>
                            </span>
                            <div className='usage-guide-reading'>
                                <span className='usage-guide-ruby usage-guide-ruby-active'>ふ</span>
                                <span className='usage-guide-ruby'>り</span>
                                <span className='usage-guide-ruby'>が</span>
                                <span className='usage-guide-ruby'>な</span>
                            </div>
                            <div className='usage-guide-arrow-row'>
                                <ArrowLeftRight size={18} />
                            </div>
                        </div>
                        <div className='usage-guide-copy'>
                            <h3>{t.usageStepFuriganaTitle}</h3>
                            <p>{t.usageStepFuriganaBody}</p>
                        </div>
                    </article>
                    <article className='usage-guide-card'>
                        <div className='usage-guide-preview usage-guide-preview-accent' aria-hidden='true'>
                            <span className='usage-guide-chip usage-guide-chip-accent'>
                                <ArrowUpDown size={16} />
                                <span>{t.usageStepAccentHint}</span>
                            </span>
                            <div className='usage-guide-accent-track'>
                                <span className='usage-guide-accent-line usage-guide-accent-line-primary' />
                                <span className='usage-guide-accent-drop usage-guide-accent-drop-primary' />
                            </div>
                            <div className='usage-guide-arrow-column'>
                                <ArrowUpDown size={18} />
                            </div>
                        </div>
                        <div className='usage-guide-copy'>
                            <h3>{t.usageStepAccentTitle}</h3>
                            <p>{t.usageStepAccentBody}</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
