import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "Content Crafter AI",
  description:
    "AI-powered content generation for blogs, products, and social media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="content-crafter-theme">
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
