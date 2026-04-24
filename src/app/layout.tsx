import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'WTF Bets Premium Pick Generator',
    description: 'Automated sports pick compositing and database logging via AI.',
    icons: {
        icon: '/templates/WTF_Logo.PNG',
        apple: '/templates/WTF_Logo.PNG',
    },
    openGraph: {
        images: ['/templates/WTF_Logo.PNG'],
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </head>
            <body>{children}</body>
        </html>
    );
}
