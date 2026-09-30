# Experimento: intro de boas-vindas (ようこそ)

Ao entrar, aparece "Bem-vindo" (ou "Welcome", conforme o idioma) e uma maré
de ondas japonesas sobe em cinco camadas, cobre a tela e recua revelando o
site principal. As ondas são desenhadas por código em SVG (arcos em
arco-íris, faixas, espuma com espiral), nada de imagem.

- **Ver:** `npm run dev` e abrir <http://localhost:3000/experimentos/boas-vindas>
- **Pular:** botão "Pular intro", Esc, Enter ou espaço.
- **Desfazer:** apagar esta pasta. O site principal não é alterado.

## Levar para a home

Em `src/app/page.tsx` a página é um componente cliente, então o jeito mais
simples é criar um `src/app/page.tsx` novo que embrulhe a home atual:

1. Renomeie o arquivo atual para `src/components/home.tsx` (export default `Home`).
2. No `src/app/page.tsx`, renderize `<WelcomeIntro><Home /></WelcomeIntro>`.

Para mostrar a intro só na primeira visita da sessão, dá para guardar uma marca
no `sessionStorage` dentro do `WelcomeIntro`.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `page.jsx` | Rota: site principal com a intro por cima, fonte mincho, `noindex` |
| `_components/WelcomeIntro.jsx` | Tela de boas-vindas, linha do tempo e camadas da onda |
| `_lib/waves.js` | Gerador das ondas (arcos, faixas, espuma, cores das camadas) |
| `intro.css` | Fonte dos kanji |
