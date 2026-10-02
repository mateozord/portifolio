# Experimento: portfólio ukiyo-e (波)

O portfólio inteiro no estilo das estampas japonesas de ondas. Ao entrar, a
intro de boas-vindas (`../_intro/`) cobre a tela com a maré e recua revelando o
hero: **a gravura real de Hokusai (domínio público) quebrando com o scroll**.
O hero é alto e a tela fica presa; um shader WebGL de deslocamento dobra a
crista para a frente conforme o progresso (só a água se mexe: céu, Fuji e o
cartucho ficam firmes), a espuma se desfaz, e entre 20% e 60% um emissor solta
gotas que despencam até a maré a nanquim da base. Português e inglês.

- **Ver:** `npm run dev` e abrir <http://localhost:3000/experimentos/ukiyo-e>
- **Desfazer:** apagar esta pasta e `../_intro/`. O site principal não depende delas.

Os textos de projetos, serviços, sobre, processo e contato vêm de
`src/content/portfolio-content.ts`, o mesmo arquivo do site principal. Só os
títulos temáticos ficam em `_lib/copy.js`.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `page.jsx` | Rota, fonte Shippori Mincho e `noindex` |
| `ukiyo.css` | Cores de dia/noite, textura de papel e animações |
| `_lib/koi-engine.js` | Lago de koi: nado, cardume, curiosidade pelo cursor, ração no clique |
| `_lib/copy.js` | Títulos temáticos e kanji (PT/EN) |
| `_lib/use-night.js` | Dia/noite, com transição em círculo |
| `_lib/random.js` | Aleatório com semente |
| `_components/HokusaiScrollDriven.jsx` | Gravura + canvas WebGL + canvas das gotas, ligados ao progresso |
| `_lib/hokusai-break.js` | Shader da quebra (giro da crista, espuma, luar) e emissor de gotas |
| `_components/ScrollDrivenWave.jsx`, `_lib/wave-break.js` | Versão anterior (onda desenhada em código), sem uso no momento |
| `_components/InkTide.jsx` | Maré a nanquim em 3 camadas (base do hero e rodapé) |
| `_components/Hero.jsx` | Céu, sol/lua, Fuji, mar e o texto |
| `_components/tides.jsx` | Divisórias entre seções, faixa do rodapé e fundo Mizu |
| `_components/Header.jsx` | Menu com kanji, PT/EN e dia/noite |
| `_components/Services.jsx`, `Projects.jsx`, `ProjectScroll.jsx`, `About.jsx`, `Process.jsx`, `Contact.jsx`, `Footer.jsx`, `ToolsBand.jsx` | As seções |
| `_components/ornaments.jsx` | Carimbo hanko, títulos, seigaiha e ensō |

## Kanji usados

波 onda · 技 técnica · 作品 obras · 人 pessoa · 流れ fluxo · 便り carta ·
道具 ferramentas · 鯉 carpa · 水 água · 流 fluxo · 網 web · 数 dados ·
機 automação · 画 design · 昼 dia · 夜 noite

## A gravura

`public/ukiyo/great-wave-*.webp` vêm do SVG traçado da gravura original
(domínio público). `great-wave-mask.png` diz ao shader o que é água (R), onde
caem os borrifos (G) e o que é céu (B). A geometria da quebra (centro do tubo,
crista, alcance, giro) fica no objeto `BREAK` de `_lib/hokusai-break.js`.
