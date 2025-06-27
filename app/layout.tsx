import { ThemeProvider } from "@/components/theme-provider";
import type React from "react";
import "./globals.css";
import { AuthGuard } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthGuard>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            {children}
          </ThemeProvider>
        </AuthGuard>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
