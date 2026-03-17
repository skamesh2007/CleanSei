import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SwachhApp",
  description: "Community waste reporting platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, inter.variable, "font-sans")}
    >
      <body className="bg-gray-50 dark:bg-background">
        <ThemeProvider>
          {/* Main content — padded at bottom so content isn't hidden behind nav */}
          <main className="pb-[76px]">{children}</main>

          {/* Bottom navigation bar — mirrors Expo Router <Tabs> */}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}