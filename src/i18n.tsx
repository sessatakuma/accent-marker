import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

type Locale = 'en' | 'ja' | 'zh';

interface TranslationSet {
    accentMarkerLabel: string;
    accentResultLabel: string;
    accentToggle: string;
    copyAsText: string;
    copyFailed: string;
    copied: string;
    editFurigana: string;
    exportHtml: string;
    exportHtmlSuccess: string;
    exportImage: string;
    exportOptions: string;
    exportThemeDark: string;
    exportThemeLight: string;
    fallbackStatus: string;
    faviconAltBrand: string;
    furiganaInputWarning: string;
    heading: string;
    htmlExportAriaLabel: string;
    htmlExportTitle: string;
    inputAriaLabel: string;
    inputDescription: string;
    inputLabel: string;
    inputPanelLabel: string;
    inputPlaceholder: string;
    inputTools: string;
    pageDescription: string;
    randomSample: string;
    result: string;
    resultActions: string;
    resultHint: string;
    resultPanelLabel: string;
    resultsAndInput: string;
    saveAndCopy: string;
    skipToContent: string;
    statusUpdated: (count: number) => string;
    switchAccent: string;
    title: string;
    toggleImageTheme: (isDarkResult: boolean) => string;
    pasteFromClipboard: string;
}

interface I18nContextValue {
    locale: Locale;
    lang: string;
    t: TranslationSet;
}

const STORAGE_KEY = 'accent-marker-locale';
const DEFAULT_LOCALE: Locale = 'en';

const translations: Record<Locale, TranslationSet> = {
    en: {
        accentMarkerLabel: 'Accent Marker',
        accentResultLabel: 'Pitch accent analysis result',
        accentToggle: 'Accent',
        copyAsText: 'Copy as text',
        copyFailed: 'Copy failed',
        copied: 'Copied',
        editFurigana: 'Edit furigana',
        exportHtml: 'HTML',
        exportHtmlSuccess: 'HTML exported',
        exportImage: 'Image',
        exportOptions: 'Export options',
        exportThemeDark: 'dark',
        exportThemeLight: 'light',
        fallbackStatus:
            'The server did not respond, so a simplified analysis result is shown instead.',
        faviconAltBrand: 'Sessatakuma',
        furiganaInputWarning: 'Only kana can be entered for furigana',
        heading: 'Accent Marker | Japanese Pitch Accent & Furigana Tool',
        htmlExportAriaLabel: 'Accent-marked text export',
        htmlExportTitle: 'Accent Marker Export',
        inputAriaLabel: 'Japanese text to analyze',
        inputDescription:
            'Analysis results appear in the panel on the right. While editing, you can change pitch accent and edit furigana directly.',
        inputLabel: 'Japanese text to analyze',
        inputPanelLabel: 'Input',
        inputPlaceholder: 'Enter Japanese text...',
        inputTools: 'Input tools',
        pageDescription:
            'Paste Japanese text to add furigana and pitch-accent markings automatically, then edit and export the result.',
        pasteFromClipboard: 'Paste from clipboard',
        randomSample: 'Insert sample text',
        result: 'Result',
        resultActions: 'Result actions',
        resultHint: 'Click furigana or accent marks to edit',
        resultPanelLabel: 'Result',
        resultsAndInput: 'Input and analysis result',
        saveAndCopy: 'Export and copy',
        skipToContent: 'Skip to content',
        statusUpdated: count => `Analysis updated. Displaying ${count} words.`,
        switchAccent: 'Toggle accent',
        title: 'Accent Marker | Japanese Pitch Accent & Furigana Tool',
        toggleImageTheme: isDarkResult =>
            `Switch image theme to ${isDarkResult ? 'light' : 'dark'}`,
    },
    ja: {
        accentMarkerLabel: 'アクセントマーカー',
        accentResultLabel: 'アクセント解析結果',
        accentToggle: 'アクセント',
        copyAsText: 'テキスト形式でコピー',
        copyFailed: 'コピーに失敗しました',
        copied: 'コピーしました',
        editFurigana: 'ふりがなを編集',
        exportHtml: 'HTML',
        exportHtmlSuccess: 'HTMLを書き出しました',
        exportImage: '画像',
        exportOptions: '保存オプション',
        exportThemeDark: 'ダーク',
        exportThemeLight: 'ライト',
        fallbackStatus: 'サーバーからの応答がないため、簡易解析結果を表示しています。',
        faviconAltBrand: 'せっさたくま',
        furiganaInputWarning: 'ふりがなにはかなのみ入力できます',
        heading: '日本語アクセントマーカー',
        htmlExportAriaLabel: 'アクセント付きテキスト書き出し',
        htmlExportTitle: 'Accent Marker Export',
        inputAriaLabel: '解析する日本語テキスト',
        inputDescription:
            '解析結果は右側の結果領域に表示されます。編集中はアクセントを切り替えたり、ふりがなを直接修正できます。',
        inputLabel: '解析する日本語テキスト',
        inputPanelLabel: '入力',
        inputPlaceholder: '文章を入力...',
        inputTools: '入力補助',
        pageDescription:
            '日本語テキストにふりがなとピッチアクセントを自動で付与し、編集して書き出せる学習ツールです。',
        pasteFromClipboard: 'クリップボードから貼り付け',
        randomSample: 'サンプル文を生成',
        result: '結果',
        resultActions: '結果の操作',
        resultHint: 'ふりがな・アクセントをクリックして編集',
        resultPanelLabel: '結果',
        resultsAndInput: '入力と解析結果',
        saveAndCopy: '書き出しとコピー',
        skipToContent: '本文へ移動',
        statusUpdated: count => `解析結果を更新しました。${count}件の語を表示しています。`,
        switchAccent: 'アクセントを切り替え',
        title: 'Accent Marker | Japanese Pitch Accent & Furigana Tool',
        toggleImageTheme: isDarkResult =>
            `画像テーマを${isDarkResult ? 'ライト' : 'ダーク'}に切り替え`,
    },
    zh: {
        accentMarkerLabel: 'Accent Marker',
        accentResultLabel: '重音分析結果',
        accentToggle: '重音',
        copyAsText: '复制为文字',
        copyFailed: '复制失败',
        copied: '已复制',
        editFurigana: '编辑振假名',
        exportHtml: 'HTML',
        exportHtmlSuccess: '已导出 HTML',
        exportImage: '图片',
        exportOptions: '导出选项',
        exportThemeDark: '深色',
        exportThemeLight: '浅色',
        fallbackStatus: '服务器没有响应，因此改为显示简化分析结果。',
        faviconAltBrand: '切磋琢磨',
        furiganaInputWarning: '振假名只能输入假名',
        heading: 'Accent Marker | 日语重音与振假名工具',
        htmlExportAriaLabel: '重音标注文本导出',
        htmlExportTitle: 'Accent Marker Export',
        inputAriaLabel: '要分析的日语文本',
        inputDescription:
            '分析结果会显示在右侧结果区域。编辑时可以切换重音，也可以直接修改振假名。',
        inputLabel: '要分析的日语文本',
        inputPanelLabel: '输入',
        inputPlaceholder: '输入日语文本...',
        inputTools: '输入工具',
        pageDescription:
            '粘贴日语文本，自动添加振假名与音高重音标记，并可进一步编辑和导出结果。',
        pasteFromClipboard: '从剪贴板粘贴',
        randomSample: '插入示例文本',
        result: '结果',
        resultActions: '结果操作',
        resultHint: '点击振假名或重音标记即可编辑',
        resultPanelLabel: '结果',
        resultsAndInput: '输入与分析结果',
        saveAndCopy: '导出与复制',
        skipToContent: '跳到主要内容',
        statusUpdated: count => `分析结果已更新，当前显示 ${count} 个词语。`,
        switchAccent: '切换重音',
        title: 'Accent Marker | Japanese Pitch Accent & Furigana Tool',
        toggleImageTheme: isDarkResult =>
            `将图片主题切换为${isDarkResult ? '浅色' : '深色'}`,
    },
};

const localeToLang: Record<Locale, string> = {
    en: 'en',
    ja: 'ja',
    zh: 'zh-Hant',
};

const I18nContext = createContext<I18nContextValue | null>(null);

function normalizeLocale(rawLocale: string | null | undefined): Locale | null {
    if (!rawLocale) {
        return null;
    }

    const value = rawLocale.toLowerCase();
    if (value.startsWith('ja')) {
        return 'ja';
    }
    if (value.startsWith('zh')) {
        return 'zh';
    }
    if (value.startsWith('en')) {
        return 'en';
    }

    return null;
}

function resolveInitialLocale(): Locale {
    if (typeof window === 'undefined') {
        return DEFAULT_LOCALE;
    }

    const searchLocale = normalizeLocale(new URLSearchParams(window.location.search).get('lang'));
    if (searchLocale) {
        window.localStorage.setItem(STORAGE_KEY, searchLocale);
        return searchLocale;
    }

    const storedLocale = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (storedLocale) {
        return storedLocale;
    }

    return normalizeLocale(window.navigator.language) ?? DEFAULT_LOCALE;
}

function updateMetadata(locale: Locale, translation: TranslationSet): void {
    document.documentElement.lang = localeToLang[locale];
    document.title = translation.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', translation.pageDescription);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    ogTitle?.setAttribute('content', translation.title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    ogDescription?.setAttribute('content', translation.pageDescription);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    twitterTitle?.setAttribute('content', translation.title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    twitterDescription?.setAttribute('content', translation.pageDescription);
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale] = useState<Locale>(resolveInitialLocale);
    const value = useMemo<I18nContextValue>(
        () => ({
            locale,
            lang: localeToLang[locale],
            t: translations[locale],
        }),
        [locale],
    );

    useEffect(() => {
        updateMetadata(locale, translations[locale]);
    }, [locale]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }

    return context;
}
