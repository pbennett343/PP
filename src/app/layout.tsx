import "./globals.css";

export const metadata = {
    title: "PP Platform",
    description: "AI-powered sports betting pick generator",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
