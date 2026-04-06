import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerAuth } from "@/features/auth/queries";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/shared/header/Header";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";

// next-intl
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sohar Water | مياه صحار",
  description: "Natural water products from Sohar, Oman. - أفضل مياه طبيعية من صحار، عمان.",
};

import Logo from "@/components/shared/Logo";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  // 1. Fetch user data on server to hydrate AuthContext (Zero flash logic)
  const initialUser = await getServerAuth();

  // 2. Extract locale and messages
  const { lang } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages} locale={lang}>
          {/* State Providers */}
          <AuthProvider initialUser={initialUser}>
            <CartProvider>
              
              {/* Global UI Structure */}
              <Header />
              <Navbar logo={<Logo />} />

              <main className="flex-1">
                {children}
              </main>

              <Footer />
              
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
