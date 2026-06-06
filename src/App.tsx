'use client';

import { Analytics } from '@vercel/analytics/react';

import Main from './components/Main';
import { I18nProvider } from './i18n';

export default function App() {
    return (
        <I18nProvider>
            <Main />
            <Analytics />
        </I18nProvider>
    );
}
