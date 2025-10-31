import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "nasa.nihad.tech — An elegant unofficial NASA fan site",
  description: "A modern, elegant, for-fun tribute to exploration, missions, and imagery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (systemDark ? 'dark' : 'light');
                  var root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                    root.style.setProperty('--background', '#0a0a0a');
                    root.style.setProperty('--foreground', '#ededed');
                  } else {
                    root.classList.remove('dark');
                    root.style.setProperty('--background', '#ffffff');
                    root.style.setProperty('--foreground', '#171717');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
