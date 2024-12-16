import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/ui/theme-toggle";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Created by Kielo Mercado",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <main className="w-full relative min-h-screen">
                {children}
              </main>
              <ThemeToggle />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
