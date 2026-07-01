import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/shared/query-provider";
import { SessionProvider } from "@/components/shared/session-provider";
import { auth } from "@/lib/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "LearnEarn 360 – Learn Skills. Build Connections. Earn Money.",
    template: "%s | LearnEarn 360",
  },
  description:
    "The all-in-one platform to learn skills, connect with a community, stay accountable, and build real income. Join thousands of learners and earners.",
  keywords: ["learn coding", "earn money online", "freelancing", "community", "courses", "skills"],
  authors: [{ name: "LearnEarn 360" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "LearnEarn 360",
    description: "Learn Skills. Build Connections. Earn Money.",
    siteName: "LearnEarn 360",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnEarn 360",
    description: "Learn Skills. Build Connections. Earn Money.",
  },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider session={session}>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
