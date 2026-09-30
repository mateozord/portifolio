import { Shippori_Mincho } from "next/font/google";
import WelcomeIntro from "../_intro/WelcomeIntro";
import UkiyoSite from "./_components/UkiyoSite";
import "./ukiyo.css";

const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "Mateus Fantin · Ukiyo-e",
  description: "Portfólio de Mateus Fantin no estilo das gravuras japonesas: ondas, koi, dia e noite.",
  // Versão experimental: fora dos buscadores.
  robots: { index: false, follow: false },
};

export default function UkiyoPage() {
  return (
    <div className={mincho.variable}>
      <WelcomeIntro>
        <UkiyoSite />
      </WelcomeIntro>
    </div>
  );
}
