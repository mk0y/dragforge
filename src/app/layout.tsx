import { AppSidebar } from "@/components/app-sidebar";
import ModeSwitch from "@/components/mode-switch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Dragforge",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full flex flex-col flex-1">
            <div className="flex flex-0 justify-between px-6 py-2 items-center">
              <SidebarTrigger size="icon" variant="secondary" className="rounded-full w-9 h-9" />
              <ModeSwitch />
            </div>
            {children}
          </main>
        </SidebarProvider>
        <Script src="https://cdn.tailwindcss.com" />
      </body>
    </html>
  );
}
