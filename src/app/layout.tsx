"use client";

import React from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ConfigProvider, App as AntApp } from "antd";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { revampedTheme } from "@/config/theme";
import { MotionConfig } from "framer-motion";
import "antd/dist/reset.css";
import "@/styles/globals.css";
import "@/styles/components.css";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon Configuration */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/favicon.ico" />

        {/* Web App Manifest */}
        <meta name="theme-color" content="#2563eb" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://ik.imagekit.io" />
      </head>
      <body style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
        <SessionProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange={false}
                >
                  <ConfigProvider theme={revampedTheme}>
                    <MotionConfig
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 120,
                        mass: 0.8,
                      }}
                      reducedMotion="user"
                    >
                      <div className="relative">
                        <main
                          style={{ minHeight: "100vh", background: "#ffffff" }}
                        >
                          {children}
                        </main>
                        <Toaster
                          position="top-right"
                          theme="light"
                          richColors
                          closeButton
                          duration={4000}
                          visibleToasts={5}
                        />
                      </div>
                    </MotionConfig>
                  </ConfigProvider>
                </ThemeProvider>
                <ReactQueryDevtools
                  initialIsOpen={false}
                  buttonPosition="bottom-right"
                />
              </QueryClientProvider>
            </PersistGate>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
