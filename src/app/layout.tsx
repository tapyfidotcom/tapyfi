import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CustomLayout from "@/layout-provider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "TapyFi - Your E-commerce Platform",
  description: "Modern e-commerce platform with multi-role support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const savedTheme = localStorage.getItem('theme') || 'system';
                    const root = document.documentElement;
                    
                    root.classList.remove('light', 'dark');
                    
                    let shouldBeDark = false;
                    
                    if (savedTheme === 'dark') {
                      shouldBeDark = true;
                    } else if (savedTheme === 'light') {
                      shouldBeDark = false;
                    } else {
                      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    }
                    
                    if (shouldBeDark) {
                      root.classList.add('dark');
                    } else {
                      root.classList.add('light');
                    }
                    
                    root.style.colorScheme = shouldBeDark ? 'dark' : 'light';
                    
                  } catch (e) {
                    console.error('Theme initialization error:', e);
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                })();
              `,
            }}
          />
        </head>
        <body>
          <ThemeProvider
            defaultTheme="system"
            storageKey="theme"
          >
            <CustomLayout>{children}</CustomLayout>
            <Toaster 
              position="top-center" 
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
