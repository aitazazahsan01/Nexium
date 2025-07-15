// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const noto_nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-urdu',
});

export const metadata: Metadata = {
  title: "Blog Summarizer AI | Aitazaz Ahsan",
  description: "Nexium Internship Assignment by Muhammad Aitazaz Ahsan, NUST",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          noto_nastaliq.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
