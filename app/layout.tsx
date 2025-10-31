import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import ThemeProvider from "../context/Theme";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "CodeVerse",
  description: `A community-driven platform for asking and answering programming questions. 
    Get help, share knowledge, and collaborate with developers from around the world. 
    Explore topics in web development, mobile app development, algorithms, data structures, and more!`,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/site-logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/images/site-logo.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
