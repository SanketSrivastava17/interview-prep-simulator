import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Interview Prep Simulator - AI-Powered Practice',
    description: 'Practice technical and behavioral interviews with real-time AI feedback. Built with Pydantic AI.',
    keywords: 'interview, practice, AI, feedback, preparation, technical interview, behavioral interview',
    authors: [{ name: 'Your Name' }],
    openGraph: {
        title: 'Interview Prep Simulator',
        description: 'AI-powered interview practice platform',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#1f2937',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                        loading: {
                            iconTheme: {
                                primary: '#3b82f6',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    )
}
