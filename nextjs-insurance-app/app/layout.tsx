import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { getPublicCompanySettings } from "@/lib/api/public-settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicCompanySettings();
  
  return {
    title: settings?.companyName 
      ? `${settings.companyName} - Asistencia al Viajero`
      : "BarmenTech Seguros - Asistencia al Viajero",
    description: "Representantes oficiales de AssistCard en Costa Rica. Seguros de viaje con cobertura médica, equipaje y asistencia 24/7.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings server-side for SEO
  const settings = await getPublicCompanySettings();

  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {settings?.faviconUrl && (
          <link rel="icon" href={settings.faviconUrl} />
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Header settings={settings} />
          {children}
          <Footer settings={settings} />
        </AuthProvider>
      </body>
    </html>
  );
}
