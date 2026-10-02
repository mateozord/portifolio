import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { MarketDemo } from "./market-demo";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Mercadinho Quintal · demonstração",
  description: "Demonstração de site para mercado criada por Mateus Fantin. Negócio fictício.",
  openGraph: {
    title: "Mercadinho Quintal · demonstração",
    description: "Demonstração de site para mercado: ofertas da semana e pedido pelo WhatsApp.",
    url: "/demos/mercado",
    siteName: "Mateus Fantin",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/negocios/mercado-desktop.webp", width: 1440, height: 900, alt: "Demonstração de site para mercado" }],
  },
  // Negócio fictício: não deve aparecer nas buscas como se fosse real
  robots: { index: false, follow: true },
};

export default function MercadoDemoPage() {
  return (
    <div className={fraunces.variable}>
      <MarketDemo />
    </div>
  );
}
