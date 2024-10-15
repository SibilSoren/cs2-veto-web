import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CS2 Map Veto",
  description:
    "The CS2 Map Veto Tool is an intuitive web application designed for Counter-Strike 2 players to streamline the map veto process. With a user-friendly interface, players can efficiently manage map selections and bans in competitive matches. The app features real-time updates, allowing teams to execute their veto strategies smoothly and collaboratively. Perfect for both casual and professional players, this tool enhances the gameplay experience by simplifying map management, ensuring fair play, and fostering strategic decisions. Join the competitive scene with ease and confidence!",
  keywords: [
    "CS2",
    "Counter-Strike 2",
    "map veto",
    "competitive gaming",
    "map selection",
    "gaming tool",
    "esports",
    "player strategy",
  ],
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
