import AppDnd from "@/components/app-dnd";
import { AppSidebar } from "@/components/app-sidebar";
import ModeSwitch from "@/components/mode-switch";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Hand } from "lucide-react";
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
          <AppDnd>
            <AppSidebar />
            <main id="main" className="relative w-full flex flex-col flex-1 px-2">
              <div className="flex flex-0 justify-between py-2 items-center">
                <SidebarTrigger
                  size="icon"
                  variant="secondary"
                  className="rounded-full w-9 h-9"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full w-9 h-9"
                >
                  <Hand size="14" />
                </Button>
                <ModeSwitch />
              </div>
              {children}
            </main>
          </AppDnd>
        </SidebarProvider>
        <Script src="https://cdn.tailwindcss.com" />
      </body>
    </html>
  );
}
