# Experimento: Cozy Japanese Waves & Magic

Hero isolado com ondas japonesas (ukiyo-e) animadas em Canvas, café e código.
Não mexe em nada do site principal.

- **Ver:** `npm run dev` e abrir <http://localhost:3000/experimentos/ondas-japonesas>
- **Desfazer:** apagar esta pasta inteira (`src/app/experimentos/`). Mais nada depende dela.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `page.jsx` | Rota da página, fonte Shippori Mincho e `noindex` (fora do Google) |
| `ondas.css` | Deixa o fundo da janela escuro só nesta página |
| `_components/JapaneseWaveHero.jsx` | O hero: céu, sol âmbar, névoa, card de vidro, título e botões |
| `_components/WaveCanvas.jsx` | Liga o motor das ondas a um `<canvas>` |
| `_components/wave-engine.js` | Desenho das ondas: cristas agudas, hachuras, espuma, ondulações do cursor e partículas |
| `_components/RippleButton.jsx` | Botão com ondulação no clique |
| `_components/SeigaihaPattern.jsx` | Padrão seigaiha (escamas de onda) no fundo |

A pasta `_components` começa com `_` para o Next não transformá-la em rota.

## Levar para o site principal

Se gostar, dá para trocar o hero da home: em `src/app/page.tsx`, substituir
`<Hero dictionary={dictionary} />` por `<JapaneseWaveHero />` (importando deste
caminho) e mover o `ondas.css`/fonte junto. Os textos daqui estão só em português.
