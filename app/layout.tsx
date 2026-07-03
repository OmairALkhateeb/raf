import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DeliveryLocationProvider } from "@/contexts/DeliveryLocationContext";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ToastContainer from "@/components/common/Toast";

// Self-hosted via next/font — replaces the external Google Fonts <link> for
// better performance, no FOUT, and so the CSS variables below are guaranteed
// to be defined before any component renders.
//
// Cairo includes both Latin and Arabic subsets, so it doubles as the universal
// fallback for any element whose primary font (Inter or Playfair) lacks the
// glyphs being rendered — this is what stops Arabic headings from falling
// back to the browser's default serif (Times New Roman).
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RAF | Beauty, Care, Wellness & Gifts",
    template: "%s | RAF",
  },
  description: "Shop premium beauty, makeup, perfumes, skincare, lashes, nails, beauty devices, health & nutrition, and beautifully packaged gifts — delivered across Oman.",
  keywords: ["Oman", "beauty", "makeup", "perfumes", "skincare", "lashes", "nails", "beauty devices", "health and nutrition", "gifts", "Amouage"],
  authors: [{ name: "RAF" }],
  creator: "RAF",
  openGraph: {
    type: "website",
    locale: "en_OM",
    alternateLocale: "ar_OM",
    title: "RAF | Beauty, Care, Wellness & Gifts",
    description: "Premium beauty, care, wellness and gifts — elegantly curated for Oman.",
    siteName: "RAF",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full ${cairo.variable} ${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] font-sans">
        <LanguageProvider>
          <DeliveryLocationProvider>
          <CartProvider>
            <WishlistProvider>
              <AppProvider>
                <Header />
                <MobileMenu />
                <main className="flex-1 page-transition">
                  {children}
                </main>
                <Footer />
                {/* Spacer so the fixed mobile bottom nav never covers the footer */}
                <div className="h-16 lg:hidden" aria-hidden="true" />
                <MobileBottomNav />
                <ToastContainer />
              </AppProvider>
            </WishlistProvider>
          </CartProvider>
          </DeliveryLocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
