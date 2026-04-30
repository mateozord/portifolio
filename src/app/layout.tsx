import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://mateus-fantin-portfolio.vercel.app"),
  title: "Mateus Fantin | Portfólio",
  description:
    "Portfólio profissional de Mateus Fantin com resumo, projetos e competências.",
  openGraph: {
    title: "Mateus Fantin | Portfólio",
    description:
      "Conheça o trabalho de Mateus Fantin: projetos, experiência e trajetória profissional.",
    url: "https://mateus-fantin-portfolio.vercel.app",
    siteName: "Mateus Fantin Portfolio",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/profile.jpg",
        width: 600,
        height: 600,
        alt: "Foto de perfil de Mateus Fantin",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
