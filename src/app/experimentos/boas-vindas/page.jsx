import { Shippori_Mincho } from "next/font/google";
import Home from "@/app/page";
import WelcomeIntro from "../_intro/WelcomeIntro";

const mincho = Shippori_Mincho({
  variable: "--font-mincho-intro",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata = {
  title: "Mateus Fantin | Boas-vindas",
  description: "Portfólio de Mateus Fantin, com intro de boas-vindas e ondas japonesas.",
  // Versão de teste: fora dos buscadores.
  robots: { index: false, follow: false },
};

/** O site principal, com a intro de boas-vindas na entrada. */
export default function BoasVindasPage() {
  return (
    <div className={mincho.variable}>
      <WelcomeIntro>
        <Home />
      </WelcomeIntro>
    </div>
  );
}
