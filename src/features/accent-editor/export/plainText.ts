import { getAccentArray, getAccentNumberFromArray, getReadingFromFurigana } from 'utilities/accent';
import { placeholder } from 'utilities/placeholder';

import type { Word } from '../domain/types';

export function buildPlainTextExport(words: Word[], showAccent: boolean): string {
    return words
        .map(word => {
            const accentIndex = getAccentNumberFromArray(getAccentArray(word));
            const reading = getReadingFromFurigana(word.furigana)
                .replaceAll(placeholder, '')
                .trim();

            if (!showAccent) {
                if (reading.length > 0 && word.surface !== reading) {
                    return `${word.surface}（${reading}）`;
                }

                return word.surface;
            }

            if (reading.length > 0 && word.surface !== reading) {
                return `${word.surface}（${reading}｜${accentIndex}）`;
            }

            return `${word.surface}（${accentIndex}）`;
        })
        .join('');
}
