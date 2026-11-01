# 🍻 Resenha Party Hub (SPA Web)

Uma **Single Page Application (SPA)** completa, ultra-responsiva e sem dependências externas, contendo um **Hub de 6 Mini-Jogos de Bebedeira e Resenha** para jogar em grupo em um smartphone ou notebook compartilhado.

---

## 🎮 Os 6 Mini-Jogos Inclusos

1. **🍾 A Garrafa (Verdade, Desafio ou Consequência)**
   * Representação vetorial com física realista de desaceleração (damping) e clique de giro.
   * Posicionamento radial dinâmico dos jogadores em círculo.
   * O **Gargalo** aponta para a Vítima e a **Base** aponta para o Juiz (garantindo que nunca sejam a mesma pessoa).
   * Modos **Verdade** e **Desafio** com banco de perguntas/tarefas hilárias, além da opção de arregada imediata e pontuação no placar.

2. **👉 Quem é Mais Provável? (Most Likely To)**
   * Mais de 90 perguntas separadas em 3 níveis: **Suave**, **Resenha Pura** e **Proibido (+18)**.
   * Botão de contagem regressiva sincronizada de 3 segundos (*3... 2... 1... APONTEM!*) com sintetizador de áudio nativo.
   * Botões contextuais para marcar a pessoa mais votada e somar shots na hora.

3. **🙅 Eu Nunca (Never Have I Ever)**
   * Cada jogador ativo inicia com **5 Vidas** (❤️).
   * Afirmações divididas em: **Geral**, **Relacionamentos**, **Vergonha Alheia** e **Extremo (+18)**.
   * Botões individuais rápidos: *"Eu Já! 🙋 (-1❤️ +1🥃)"*.
   * Quem zera as vidas é marcado como **Eliminado** com alerta de punição coletiva.

4. **👑 Copo do Rei Virtual (King's Cup)**
   * Baralho virtual completo de 52 cartas embaralhadas aleatoriamente.
   * Carta interativa com **animação 3D Flip**.
   * Regras explicadas na tela para cada carta (Ás até Rei).
   * Taça central em SVG com líquido neon que sobe conforme os Reis são retirados.
   * Ao tirar o **4º Rei**, um alerta máximo em tela cheia é acionado com som estrondoso e tela piscante para virar o Copo do Rei!

5. **💣 Bomba-Relógio (Tique-Taque / Passa a Bomba)**
   * Sorteador de categorias rápidas (mais de 50 temas da cultura e resenha brasileira).
   * **Tempo secreto aleatório** (entre 15 e 45 segundos).
   * Efeito sonoro contínuo de tique-taque sintetizado via Web Audio API que aumenta progressivamente em tom, velocidade e urgência.
   * Botão gigante neon: **"💥 PASSA A BOMBA!"** com feedback visual e rotação automática de participantes.
   * Ao estourar: explosão com ruído branco filtrado, tela tremendo em vermelho sangue e penalidade automática de shot.

6. **🙆 Quem Sou Eu? (Modo "Na Testa" / Heads Up)**
   * Feito para segurar o celular na horizontal na testa virado para os amigos.
   * 5 Categorias: *Memes & Figuras BR*, *Animes & Games*, *Filmes & Séries*, *Comidas & Coisas* e *Modo Caos Total*.
   * Contagem preparatória de 3 segundos (*"COLOQUE NA TESTA!"*).
   * Tipografia gigante em alto contraste legível a mais de 2 metros de distância.
   * Cronômetro de 60 segundos com aviso visual e sonoro nos últimos 10s.
   * Toque dividido na tela: **Lado Direito (Verde): Acertou!** / **Lado Esquerdo (Vermelho): Passou / Errou**.
   * Resumo completo com pontuação ao final e opções de computar pontos ou pagar shots.

---

## 💎 Destaques Técnicos & Arquitetura

* **Stack:** HTML5 Semântico, CSS3 Moderno (Flexbox, Grid, Animações 3D GPU, Variáveis CSS, Glassmorphism `backdrop-filter: blur`) e JavaScript Puro (Vanilla ES6+).
* **Tema Visual:** *Night Party Neon / Dark Cyberpunk* (`#0d0d13`, acentos em Ciano `#00f3ff`, Roxo `#bc13fe`, Rosa `#ff007f`, Verde `#00ff88` e Amarelo `#ffe600`).
* **Sintetizador Web Audio API (`SoundFX`):** 100% nativo, zero arquivos `.mp3`/`.wav` externos. Produz beeps, contagens, cliques, ruído branco filtrado para explosões, buzina e fanfarras.
* **Resiliência Crítica & Failsafes:**
  * Máquina de estados rigorosa (`IDLE`, `IN_PROGRESS`, `PAUSED`, `RESOLVED`).
  * Cancelamento seguro de todos os `requestAnimationFrame`, `setTimeout` e `setInterval` ao navegar entre telas ou reiniciar partidas.
  * Failsafes com timeout máximo nas animações para impedir qualquer travamento de loop.
  * Modais com fechamento redundante (botão, clique fora e tecla `Escape`).
* **Persistência de Sessão:** Salva jogadores e pontuações no `localStorage`.
* **Placar Geral Unificado:** Acessível a qualquer momento via botão no cabeçalho ou Floating Action Button (FAB), com ajuste rápido de Shots (🥃), Desafios (🏆) e Arregadas (🐔).
* **Jogadores Padrão:** Pré-configurados com **Marquito**, **Nic** e **Vivi**, com modal de adição e remoção em tempo real.

---

## 🚀 Como Executar

Não necessita de `npm`, `node` ou servidor complexo:
1. Abra diretamente o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Safari, Firefox).
2. Para jogar no smartphone na mesma rede local, basta abrir o arquivo ou servir a pasta com qualquer servidor estático HTTP.
