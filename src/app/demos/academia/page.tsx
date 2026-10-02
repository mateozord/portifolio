import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { GymDemo } from "./gym-demo";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = {
  title: "Vértice Academia · demonstração",
  description: "Demonstração de site para academia criada por Mateus Fantin. Negócio fictício.",
  // Negócio fictício: não deve aparecer nas buscas como se fosse real
  robots: { index: false, follow: true },
};

export default function AcademiaDemoPage() {
  return (
    <div className={anton.variable}>
      <GymDemo />
    </div>
  );
}
