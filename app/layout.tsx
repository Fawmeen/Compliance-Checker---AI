import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Compliance Checker",
  description: "Upload and analyze policy documents"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`} suppressHydrationWarning>
        <div
          className="
            fixed inset-0 -z-10
            bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
            from-violet-100 via-white to-white
          "
        />

        <Navbar />

        <main className="flex-1 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
