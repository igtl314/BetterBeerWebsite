
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import NavbarWrapper from "./_compoments/NavbarWrapper";
import MobileTabBar from "./_compoments/MobileTabBar";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetterBeer",
  description: "The index of good beer in Sweden. Live stock and prices from Systembolaget, ranked by APK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="desk-only"><NavbarWrapper /></div>
          {children}
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
