import type { Metadata } from "next";
import { BusinessPage } from "./business-page";

export const metadata: Metadata = {
  title: "Sites para negócios locais | Mateus Fantin",
  description:
    "Sites rápidos para academias, restaurantes, mercados e comércios do bairro: aparecer no Google e receber clientes pelo WhatsApp.",
  openGraph: {
    title: "Sites para negócios locais | Mateus Fantin",
    description: "Seu negócio no Google e no WhatsApp: sites rápidos para academias, restaurantes, mercados e comércios do bairro.",
    url: "/negocios",
    siteName: "Mateus Fantin",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/negocios/restaurante-desktop.webp", width: 1440, height: 900, alt: "Exemplo de site para restaurante" }],
  },
};

export default function NegociosPage() {
  return <BusinessPage />;
}
