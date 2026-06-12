import type { Metadata } from "next";
import "../globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import ToastContainer from "@/components/common/Toast";

export const metadata: Metadata = {
  title: {
    default: "RAF | Authentic Omani Products",
    template: "%s | RAF",
  },
  description: "Discover premium Omani brands — fragrances, fashion, traditional crafts, food, and skincare. Celebrating Omani heritage and craftsmanship.",
  keywords: ["Oman", "Omani brands", "Arabic fashion", "Amouage", "frankincense", "traditional crafts", "Omani honey"],
  authors: [{ name: "RAF" }],
  creator: "RAF",
  openGraph: {
    type: "website",
    locale: "en_OM",
    alternateLocale: "ar_OM",
    title: "RAF | Authentic Omani Products",
    description: "Discover premium Omani brands celebrating local heritage and craftsmanship.",
    siteName: "RAF",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2]">
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <AppProvider>
                <Header />
                <MobileMenu />
                <main className="flex-1 page-transition">
                  {children}
                </main>
                <Footer />
                <ToastContainer />
              </AppProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
