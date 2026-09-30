# Experimento: portfólio ukiyo-e (波)

O portfólio inteiro no estilo das estampas japonesas de ondas. Ao entrar, a
intro de boas-vindas (`../_intro/`) cobre a tela com a maré e recua revelando o
hero: um mar **totalmente animado, desenhado em SVG por código**. Cinco
fileiras de ondas rolam sem parar (as da frente mais rápido), balançam com a
maré, a espuma pulsa e gotas sobem das cristas; ao rolar a página cada fileira
anda numa velocidade (parallax). Sol vermelho e Monte Fuji de dia; lua e
estrelas à noite. Português e inglês.

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
| `_lib/ocean.js` | Fileiras do mar: cores de dia/noite e ladrilhos de ondas que emendam sem costura |
| `_lib/koi-engine.js` | Lago de koi: nado, cardume, curiosidade pelo cursor, ração no clique |
| `_lib/copy.js` | Títulos temáticos e kanji (PT/EN) |
| `_lib/use-night.js` | Dia/noite, com transição em círculo |
| `_lib/random.js` | Aleatório com semente |
| `_components/AnimatedSea.jsx` | Mar animado (usado no hero e no rodapé) |
| `_components/Hero.jsx` | Céu, sol/lua, Fuji, mar e o texto |
| `_components/tides.jsx` | Divisórias entre seções, faixa do rodapé e fundo Mizu |
| `_components/Header.jsx` | Menu com kanji, PT/EN e dia/noite |
| `_components/Services.jsx`, `Projects.jsx`, `ProjectScroll.jsx`, `About.jsx`, `Process.jsx`, `Contact.jsx`, `Footer.jsx`, `ToolsBand.jsx` | As seções |
| `_components/ornaments.jsx` | Carimbo hanko, títulos, seigaiha e ensō |

## Kanji usados

波 onda · 技 técnica · 作品 obras · 人 pessoa · 流れ fluxo · 便り carta ·
道具 ferramentas · 鯉 carpa · 水 água · 流 fluxo · 網 web · 数 dados ·
機 automação · 画 design · 昼 dia · 夜 noite
