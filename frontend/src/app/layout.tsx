import { TaskProvider } from '@/contexts/TaskContext';
import theme from '@/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import QueryProvider from '../QueryProvider';
import '../styles/globals.css';

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'ToDo App',
    description: 'ToDo app built with Next.js and Material-UI',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={poppins.variable} suppressHydrationWarning>
            <head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </head>
            <body className={poppins.variable}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <InitColorSchemeScript attribute="class" />
                        <QueryProvider>
                            <TaskProvider>
                                <main>{children}</main>
                            </TaskProvider>
                        </QueryProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
