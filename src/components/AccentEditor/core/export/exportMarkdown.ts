import { AccentValue, type AccentValueType, type Word } from '../word/accentTypes';
import { buildWordAnnotationModel, getLineBreakCount, rubyScale } from '../word/annotationLayout';

import markdownExportStyles from './markdownExport.css?raw';

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function renderAccentText(text: string, accent: AccentValueType, showAccent: boolean): string {
    const escapedText = escapeHtml(text);

    if (!showAccent) {
        return escapedText;
    }

    if (accent === AccentValue.High) {
        return `<i>${escapedText}</i>`;
    }

    if (accent === AccentValue.Drop) {
        return `<b>${escapedText}</b>`;
    }

    return escapedText;
}

function renderLineBreaks(word: Word, wordIndex: number): string | null {
    const lineBreakCount = getLineBreakCount(word.surface);

    if (lineBreakCount === 0) {
        return null;
    }

    return Array.from({ length: lineBreakCount }, (_, breakIndex) =>
        `<br data-break="${wordIndex}-${breakIndex}">`,
    ).join('');
}

export function buildMarkdownExport(words: Word[], showAccent: boolean): string {
    const markup = words
        .map((word, wordIndex) => {
            const lineBreakMarkup = renderLineBreaks(word, wordIndex);
            if (lineBreakMarkup) {
                return lineBreakMarkup;
            }

            const model = buildWordAnnotationModel(word);

            if (model.isKanaWord && model.kanaAccents) {
                return `<span class="word-group word-group-kana" style="width:${model.groupWidthEm}em">${
                    `<span class="word-reading-row">${model.annotatedReading
                        .map(
                            (segment, charIndex) =>
                                `<span class="word-reading-cell" style="width:${
                                    model.readingCellWidthsEm[charIndex] / rubyScale
                                }em">${renderAccentText(
                                    segment,
                                    model.kanaAccents?.[charIndex] ?? AccentValue.None,
                                    showAccent,
                                )}</span>`,
                        )
                        .join('')}</span>`
                }<span class="word-base-row">${model.annotatedSurface
                    .map(
                        (segment, charIndex) =>
                            `<span class="word-base-cell" style="width:${model.baseCellWidthsEm[charIndex]}em">${escapeHtml(
                                segment,
                            )}</span>`,
                    )
                    .join('')}</span></span>`;
            }

            return `<span class="word-inline-cluster">${
                model.prefixSurface
                    .map(segment => `<span class="word-plain-segment">${escapeHtml(segment)}</span>`)
                    .join('')
            }<span class="word-group" style="width:${model.groupWidthEm}em">${
                `<span class="word-reading-row"><span class="furigana-group">${model.annotatedReading
                    .map((segment, annotatedIndex) => {
                        const charIndex = model.annotatedStartIndex + annotatedIndex;
                        return `<span class="word-reading-cell" style="width:${
                            model.readingCellWidthsEm[annotatedIndex] / rubyScale
                        }em">${renderAccentText(
                            segment,
                            word.furigana[charIndex]?.accent ?? AccentValue.None,
                            showAccent,
                        )}</span>`;
                    })
                    .join('')}</span></span>`
            }<span class="word-base-row">${model.annotatedSurface
                .map(
                    (segment, annotatedIndex) =>
                        `<span class="word-base-cell" style="width:${model.baseCellWidthsEm[annotatedIndex]}em">${escapeHtml(
                            segment,
                        )}</span>`,
                )
                .join('')}</span></span>${
                model.suffixSurface
                    .map(segment => `<span class="word-plain-segment">${escapeHtml(segment)}</span>`)
                    .join('')
            }</span>`;
        })
        .join('');

    return `<style>${markdownExportStyles.trim()}</style><div class="accent-marker">${markup}</div>`;
}
