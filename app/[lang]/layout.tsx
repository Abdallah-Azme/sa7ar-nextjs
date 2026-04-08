import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerAuth } from "@/features/auth/queries";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { routing } from "@/i18n/config";
import Header from "@/components/shared/header/Header";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";
import Logo from "@/components/shared/Logo";

// next-intl
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import DirectionProviderWrapper from "@/components/providers/DirectionProviderWrapper";

import { Cairo } from "next/font/google";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const cairo = Cairo({
    subsets: ["arabic"],
    variable: "--font-cairo",
});


export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.home" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

import { QueryProvider } from "@/providers/QueryProvider";

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
  const paramsResolved = await params;
  const lang = (paramsResolved?.lang as "ar" | "en") ?? routing.defaultLocale;
  
  setRequestLocale(lang);
  const messages = await getMessages();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${lang === "ar" ? cairo.variable : inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider 
          messages={messages} 
          locale={lang}
          timeZone="Asia/Muscat"
        >
          <DirectionProviderWrapper dir={dir}>
            <QueryProvider>
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
            </QueryProvider>
          </DirectionProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
