import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WeatherProvider } from "@/components/weather/WeatherProvider";
import { WeatherRenderer } from "@/components/weather/WeatherRenderer";
const inter = Inter({ subsets: ["latin"] });

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "VarshaAI | Predict Today. Simulate Tomorrow. Protect India.",
  description: "AI Powered Digital Twin of India's Climate using National Data.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import { LaunchTransitionProvider } from "@/components/launch/LaunchTransitionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <WeatherProvider>
            <LaunchTransitionProvider>
              <WeatherRenderer />
              <main className="relative z-10">
                {children}
              </main>
            </LaunchTransitionProvider>
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
