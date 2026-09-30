import { Shippori_Mincho } from "next/font/google";
import JapaneseWaveHero from "./_components/JapaneseWaveHero";
import "./ondas.css";

const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata = {
  title: "Ondas Japonesas · Experimento | Mateus Fantin",
  description: "Experimento de hero com ondas japonesas animadas, café e código.",
  // Página de teste: fora dos buscadores.
  robots: { index: false, follow: false },
};

export default function OndasJaponesasPage() {
  return (
    <main className={mincho.variable}>
      <JapaneseWaveHero />
    </main>
  );
}
