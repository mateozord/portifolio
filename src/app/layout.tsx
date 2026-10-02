import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portifolio-rouge-seven-44.vercel.app"),
  title: "Mateus Fantin | Sites, sistemas e automações",
  description:
    "Mateus Fantin, desenvolvedor em São Paulo: sites, sistemas web, dashboards, automações e design — do primeiro rascunho ao produto no ar.",
  openGraph: {
    title: "Mateus Fantin | Sites, sistemas e automações",
    description:
      "Sites, sistemas web, dashboards e automações com design próprio. Conheça os projetos de Mateus Fantin.",
    url: "https://portifolio-rouge-seven-44.vercel.app",
    siteName: "Mateus Fantin",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/projects/cozylog/cover.webp",
        width: 1600,
        height: 1200,
        alt: "CozyLog, um dos projetos de Mateus Fantin",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a10" },
  ],
};

// Aplica o tema salvo (ou o do sistema) antes da primeira pintura, sem "flash".
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
