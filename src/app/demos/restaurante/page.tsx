import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import { RestaurantDemo } from "./restaurant-demo";

const dmSerif = DM_Serif_Display({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-dm-serif" });

export const metadata: Metadata = {
  title: "Brasa & Alecrim · demonstração",
  description: "Demonstração de site para restaurante criada por Mateus Fantin. Negócio fictício.",
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
