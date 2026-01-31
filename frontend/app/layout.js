import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata = {
    title: 'AI Counsellor - Study Abroad Planning',
    description: 'AI-powered guided decision system for study-abroad planning',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
            <body className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-primary-500 selection:text-white transition-colors duration-300">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                        <div className="flex flex-col min-h-screen">
                            {children}
                        </div>
                        <div className="fixed bottom-6 right-6 z-50">
                            <ThemeToggle />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
