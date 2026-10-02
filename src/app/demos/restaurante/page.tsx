import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import { RestaurantDemo } from "./restaurant-demo";

const dmSerif = DM_Serif_Display({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-dm-serif" });

export const metadata: Metadata = {
  title: "Brasa & Alecrim · demonstração",
  description: "Demonstração de site para restaurante criada por Mateus Fantin. Negócio fictício.",
  openGraph: {
    title: "Brasa & Alecrim · demonstração",
    description: "Demonstração de site para restaurante: cardápio com fotos, prato do dia e reserva pelo WhatsApp.",
    url: "/demos/restaurante",
    siteName: "Mateus Fantin",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/negocios/restaurante-desktop.webp", width: 1440, height: 900, alt: "Demonstração de site para restaurante" }],
  },
  // Negócio fictício: não deve aparecer nas buscas como se fosse real
  robots: { index: false, follow: true },
};

export default function RestauranteDemoPage() {
  return (
    <div className={dmSerif.variable}>
      <RestaurantDemo />
    </div>
  );
}
