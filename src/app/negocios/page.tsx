import type { Metadata } from "next";
import { BusinessPage } from "./business-page";

export const metadata: Metadata = {
  title: "Sites para negócios locais | Mateus Fantin",
  description:
    "Sites rápidos para academias, restaurantes, mercados e comércios do bairro: aparecer no Google e receber clientes pelo WhatsApp.",
};

export default function NegociosPage() {
  return <BusinessPage />;
}
