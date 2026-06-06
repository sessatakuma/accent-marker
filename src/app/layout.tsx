import type { ReactNode } from 'react';

import { Noto_Sans_JP } from 'next/font/google';

import type { Metadata, Viewport } from 'next';

import '../index.css';

const siteUrl = 'https://accent-marker.sessatakuma.dev/';
const description =
    'Paste Japanese text to add furigana and pitch-accent markings automatically, then edit and export the result.';
const title = 'Accent Marker | Japanese Pitch Accent & Furigana Tool';

const notoSansJp = Noto_Sans_JP({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: 'Accent Marker',
    appleWebApp: {
        title: 'Accent Marker',
    },
    alternates: {
        canonical: '/',
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        apple: '/images/logo-128.png',
        icon: '/images/logo.png',
    },
    keywords: [
        'Japanese pitch accent',
        'furigana tool',
        'Japanese pronunciation',
        'Japanese reading aid',
        'pitch accent marker',
        'Japanese learning tool',
    ],
    openGraph: {
        title,
        description,
        images: [
            {
                url: '/images/logo.png',
                alt: 'Accent Marker logo for the Japanese pitch accent and furigana tool',
            },
        ],
        locale: 'en_US',
        siteName: 'Accent Marker',
        type: 'website',
        url: siteUrl,
    },
    referrer: 'strict-origin-when-cross-origin',
    robots: {
        follow: true,
        index: true,
    },
    twitter: {
        title,
        description,
        card: 'summary',
        images: [
            {
                url: '/images/logo.png',
                alt: 'Accent Marker logo for the Japanese pitch accent and furigana tool',
            },
        ],
        site: '@sessatakuma',
    },
};

export const viewport: Viewport = {
    themeColor: '#619e83',
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Accent Marker',
    url: siteUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    description,
    image: `${siteUrl}images/logo.png`,
    inLanguage: ['en', 'ja', 'zh-Hant'],
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en' className={notoSansJp.variable}>
            <body>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <div id='root'>{children}</div>
            </body>
        </html>
    );
}
