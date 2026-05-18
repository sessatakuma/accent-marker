export function normalizeKanaText(text: string): string {
    return text.normalize('NFC');
}

export function splitKanaSyllables(kana: string): string[] {
    const smallKana = 'ゃゅょァィゥェォャュョヮぁぃぅぇぉ';
    const normalizedKana = normalizeKanaText(kana);
    const result: string[] = [];

    for (let i = 0; i < normalizedKana.length; i++) {
        const char = normalizedKana[i];
        const next = normalizedKana[i + 1];

        if (next && smallKana.includes(next)) {
            result.push(char + next);
            i++;
        } else {
            result.push(char);
        }
    }

    return result;
}

export function isKanaReading(text: string): boolean {
    return /^[ぁ-んァ-ンーゔゞ゛゜・･ー]+$/.test(normalizeKanaText(text));
}
