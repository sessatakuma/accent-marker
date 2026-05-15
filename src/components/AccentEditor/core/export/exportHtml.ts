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

    return Array.from(
        { length: lineBreakCount },
        (_, breakIndex) => `      <br data-break="${wordIndex}-${breakIndex}">`,
    ).join('\n');
}

function renderPlainStack(segment: string): string {
    const escapedSegment = escapeHtml(segment);

    return [
        '      <span class="word-stack word-stack-plain">',
        '        <span class="word-reading-row word-reading-row-empty" aria-hidden="true"></span>',
        '        <span class="word-base-row">',
        `          <span class="word-base-cell word-base-cell-plain">${escapedSegment}</span>`,
        '        </span>',
        '      </span>',
    ].join('\n');
}

function renderKanaWord(word: Word, showAccent: boolean): string {
    const model = buildWordAnnotationModel(word);

    if (!model.isKanaWord || !model.kanaAccents) {
        return '';
    }

    const readingCells = model.annotatedReading
        .map(
            (segment, charIndex) =>
                `          <span class="word-reading-cell" style="width:${
                    model.readingCellWidthsEm[charIndex] / rubyScale
                }em">${renderAccentText(
                    segment,
                    model.kanaAccents?.[charIndex] ?? AccentValue.None,
                    showAccent,
                )}</span>`,
        )
        .join('\n');

    const baseCells = model.annotatedSurface
        .map(
            (segment, charIndex) =>
                `          <span class="word-base-cell" style="width:${model.baseCellWidthsEm[charIndex]}em">${escapeHtml(
                    segment,
                )}</span>`,
        )
        .join('\n');

    return [
        `      <span class="word-group word-group-kana" style="width:${model.groupWidthEm}em">`,
        '        <span class="word-reading-row">',
        readingCells,
        '        </span>',
        '        <span class="word-base-row">',
        baseCells,
        '        </span>',
        '      </span>',
    ].join('\n');
}

function renderAnnotatedWord(word: Word, showAccent: boolean): string {
    const model = buildWordAnnotationModel(word);

    if (model.isKanaWord && model.kanaAccents) {
        return renderKanaWord(word, showAccent);
    }

    const prefixStacks = model.prefixSurface.map(renderPlainStack).join('\n');
    const suffixStacks = model.suffixSurface.map(renderPlainStack).join('\n');
    const readingCells = model.annotatedReading
        .map((segment, annotatedIndex) => {
            const charIndex = model.annotatedStartIndex + annotatedIndex;
            return `            <span class="word-reading-cell" style="width:${
                model.readingCellWidthsEm[annotatedIndex] / rubyScale
            }em">${renderAccentText(
                segment,
                showAccent ? word.furigana[charIndex]?.accent ?? AccentValue.None : AccentValue.None,
                showAccent,
            )}</span>`;
        })
        .join('\n');
    const baseCells = model.annotatedSurface
        .map(
            (segment, annotatedIndex) =>
                `          <span class="word-base-cell" style="width:${model.baseCellWidthsEm[annotatedIndex]}em">${escapeHtml(
                    segment,
                )}</span>`,
        )
        .join('\n');

    return [
        '      <span class="word-inline-cluster">',
        prefixStacks,
        `        <span class="word-stack word-stack-annotated" style="width:${model.groupWidthEm}em">`,
        '          <span class="word-reading-row">',
        '            <span class="furigana-group">',
        readingCells,
        '            </span>',
        '          </span>',
        '          <span class="word-base-row">',
        baseCells,
        '          </span>',
        '        </span>',
        suffixStacks,
        '      </span>',
    ]
        .filter(Boolean)
        .join('\n');
}

export function buildHtmlExport(words: Word[], showAccent: boolean): string {
    const content = words
        .map((word, wordIndex) => {
            const lineBreakMarkup = renderLineBreaks(word, wordIndex);

            if (lineBreakMarkup) {
                return lineBreakMarkup;
            }

            return renderAnnotatedWord(word, showAccent);
        })
        .join('\n');

    return [
        '<!DOCTYPE html>',
        '<html lang="ja">',
        '<head>',
        '  <meta charset="utf-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1">',
        '  <title>Accent Marker Export</title>',
        `  <style>${markdownExportStyles.trim()}</style>`,
        '</head>',
        '<body>',
        '  <main>',
        '    <article class="accent-marker" aria-label="Accent-marked text export">',
        content,
        '    </article>',
        '  </main>',
        '</body>',
        '</html>',
    ].join('\n');
}
