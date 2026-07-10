export const metadata = {
    title: 'Beau Wisdom – Behavioral & Mental Health Development & Educator',
    description: 'My personal portfolio and thoughts website',
};

export default function RootLayout({ children }) {
    return (
          <html lang="en">
                <head>
                        <meta charSet="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body>{children}</body>
          </html>
        );
}
