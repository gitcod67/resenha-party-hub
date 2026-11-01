/**
 * Jogo 4: Copo do Rei Virtual (King's Cup)
 * Baralho completo de 52 cartas com animação 3D flip, indicador de preenchimento do copo
 * e alerta máximo estrondoso para o 4º Rei.
 */

class CopoDoReiGame {
  constructor() {
    this.container = null;
    this.deck = [];
    this.kingsDrawn = 0;
    this.currentCard = null;
    this.isFlipping = false;
    this.initDeck();
  }

  initDeck() {
    this.deck = [];
    this.kingsDrawn = 0;
    const suits = [
      { symbol: '♠', name: 'spades', color: 'cyan' },
      { symbol: '♥', name: 'hearts', color: 'pink' },
      { symbol: '♦', name: 'diamonds', color: 'pink' },
      { symbol: '♣', name: 'clubs', color: 'cyan' }
    ];

    const cardDefs = window.ResenhaData.copoDoRei.cards;

    suits.forEach(suit => {
      cardDefs.forEach(def => {
        this.deck.push({
          value: def.value,
          name: def.name,
          rule: def.rule,
          desc: def.desc,
          suit: suit.symbol,
          suitColor: suit.color
        });
      });
    });

    this.shuffle();
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  mount(containerEl) {
    this.container = containerEl;
    this.render();
    this.attachEvents();
  }

  unmount() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  render() {
    const liquidPercent = (this.kingsDrawn / 4) * 100;

    this.container.innerHTML = `
      <div class="game-view copo-view">
        <div class="game-header">
          <h2 class="neon-text-yellow">👑 Copo do Rei</h2>
          <p class="game-subtitle">Toque no baralho para tirar uma carta e seguir a regra. Quem tirar o 4º Rei vira o copo!</p>
        </div>

        <!-- Indicador de Status & Copo Central -->
        <div class="cup-section">
          <div class="kings-tracker">
            <span class="tracker-label">Reis Retirados:</span>
            <div class="kings-icons">
              <span class="king-crown ${this.kingsDrawn >= 1 ? 'filled' : ''}">👑</span>
              <span class="king-crown ${this.kingsDrawn >= 2 ? 'filled' : ''}">👑</span>
              <span class="king-crown ${this.kingsDrawn >= 3 ? 'filled' : ''}">👑</span>
              <span class="king-crown ${this.kingsDrawn >= 4 ? 'filled' : ''}">👑</span>
            </div>
            <span class="deck-counter" id="deckCounter">${this.deck.length} cartas restantes</span>
          </div>

          <!-- Taça do Copo do Rei com Líquido Dinâmico SVG -->
          <div class="cup-graphic-wrapper">
            <svg class="cup-svg" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="cupClip">
                  <path d="M 25 15 L 135 15 L 115 140 C 115 155 95 160 80 160 C 65 160 45 155 45 140 Z"/>
                </clipPath>
                <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffe600"/>
                  <stop offset="50%" stop-color="#ff007f"/>
                  <stop offset="100%" stop-color="#bc13fe"/>
                </linearGradient>
              </defs>

              <!-- Base & Haste da Taça Real -->
              <rect x="75" y="155" width="10" height="30" fill="#ffe600" rx="3" />
              <ellipse cx="80" cy="188" rx="40" ry="8" fill="#ffe600" />

              <!-- Líquido subindo conforme Reis -->
              <g clip-path="url(#cupClip)">
                <!-- Fundo do copo -->
                <rect x="0" y="0" width="160" height="200" fill="#131424" opacity="0.6"/>
                <!-- Líquido preenchido proporcional -->
                <rect id="liquidFill" x="0" y="${160 - (145 * (this.kingsDrawn / 4))}" width="160" height="200" fill="url(#liquidGrad)" opacity="0.85">
                  <animate attributeName="opacity" values="0.75;0.95;0.75" dur="2s" repeatCount="indefinite"/>
                </rect>
              </g>

              <!-- Contorno da Taça com Glow Neon -->
              <path d="M 25 15 L 135 15 L 115 140 C 115 155 95 160 80 160 C 65 160 45 155 45 140 Z" 
                    fill="none" stroke="#ffe600" stroke-width="4" stroke-linejoin="round"/>
              <ellipse cx="80" cy="15" rx="55" ry="6" fill="none" stroke="#ffe600" stroke-width="3"/>
            </svg>
          </div>
        </div>

        <!-- Área de Tiragem com Carta 3D Flip -->
        <div class="card-draw-area">
          <div class="card-scene" id="cardScene">
            <div class="playing-card" id="playingCard">
              <!-- Verso da Carta -->
              <div class="card-face card-back">
                <div class="back-pattern">
                  <span class="back-logo">👑</span>
                  <span class="back-text">RESENHA</span>
                  <span class="back-tap">TOQUE PARA TIRAR</span>
                </div>
              </div>
              
              <!-- Frente da Carta -->
              <div class="card-face card-front" id="cardFrontFace">
                <div class="card-corner top-left">
                  <span class="card-val" id="valTop">-</span>
                  <span class="card-suit" id="suitTop">-</span>
                </div>
                <div class="card-center-symbol" id="centerSymbol">👑</div>
                <div class="card-corner bottom-right">
                  <span class="card-val" id="valBottom">-</span>
                  <span class="card-suit" id="suitBottom">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Painel de Regra da Carta Atual -->
        <div class="rule-panel hidden" id="rulePanel">
          <div class="rule-header">
            <span class="rule-card-title" id="ruleCardTitle">Ás de Copas</span>
            <h3 class="rule-name neon-text-yellow" id="ruleName">Cascata</h3>
          </div>
          <p class="rule-desc" id="ruleDesc">Todos bebem continuamente em cadeia!</p>

          <button class="draw-next-btn neon-btn-cyan" id="btnDrawNext">
            <span>Tirar Próxima Carta 🎴</span>
          </button>
        </div>

        <!-- Botão de Reiniciar Baralho -->
        <div class="cup-footer">
          <button class="shuffle-btn" id="btnShuffleDeck">
            🔄 Reiniciar & Embaralhar Baralho (52)
          </button>
        </div>

        <!-- Modal Alerta Máximo 4º Rei -->
        <div class="king-alert-modal hidden" id="kingAlertModal">
          <div class="king-alert-content">
            <div class="king-alert-crown">👑💥</div>
            <h2 class="king-alert-title neon-text-pink">4º REI RETIRADO!</h2>
            <p class="king-alert-desc">
              O COPO DO REI ESTÁ CHEIO! A pessoa que tirou esta carta deve <strong>VIRAR O COPO DO REI INTEIRO AGORA!</strong>
            </p>
            <div class="king-alert-actions">
              <button class="action-btn fail-btn" id="btnCloseKingAlert">
                <span>🥃 COPO VIRADO COM SUCESSO!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const cardScene = document.getElementById('cardScene');
    if (cardScene) {
      cardScene.addEventListener('click', () => this.drawCard());
    }

    const btnDrawNext = document.getElementById('btnDrawNext');
    if (btnDrawNext) {
      btnDrawNext.addEventListener('click', () => this.drawCard());
    }

    const btnShuffle = document.getElementById('btnShuffleDeck');
    if (btnShuffle) {
      btnShuffle.addEventListener('click', () => {
        if (confirm('Deseja reiniciar o baralho e esvaziar o Copo do Rei?')) {
          this.initDeck();
          this.render();
          this.attachEvents();
          window.soundFX.playFanfare();
        }
      });
    }

    const btnCloseKing = document.getElementById('btnCloseKingAlert');
    if (btnCloseKing) {
      btnCloseKing.addEventListener('click', () => {
        const modal = document.getElementById('kingAlertModal');
        if (modal) modal.classList.add('hidden');
      });
    }
  }

  drawCard() {
    if (this.isFlipping) return;
    if (this.deck.length === 0) {
      alert('O baralho acabou! Reiniciando e embaralhando...');
      this.initDeck();
      this.render();
      this.attachEvents();
      return;
    }

    this.isFlipping = true;
    window.soundFX.init();

    const playingCard = document.getElementById('playingCard');
    const executeDraw = () => {
      window.soundFX.playCardFlip();
      const card = this.deck.pop();
      this.currentCard = card;

      const valTop = document.getElementById('valTop');
      const suitTop = document.getElementById('suitTop');
      const centerSymbol = document.getElementById('centerSymbol');
      const valBottom = document.getElementById('valBottom');
      const suitBottom = document.getElementById('suitBottom');
      const cardFront = document.getElementById('cardFrontFace');

      if (valTop) valTop.textContent = card.value;
      if (suitTop) suitTop.textContent = card.suit;
      if (centerSymbol) centerSymbol.textContent = card.suit;
      if (valBottom) valBottom.textContent = card.value;
      if (suitBottom) suitBottom.textContent = card.suit;

      if (cardFront) {
        cardFront.className = `card-face card-front color-${card.suitColor}`;
      }

      // Vira a carta em 3D
      if (playingCard) {
        playingCard.classList.add('flipped');
      }

      // Se for Rei, contabiliza
      if (card.value === 'K') {
        this.kingsDrawn++;
      }

      window.ResenhaState.setTimeoutSafe(() => {
        this.showCardRule(card);
        this.updateCupVisual();
        this.isFlipping = false;
      }, 400);
    };

    if (playingCard && playingCard.classList.contains('flipped')) {
      playingCard.classList.remove('flipped');
      window.ResenhaState.setTimeoutSafe(() => {
        executeDraw();
      }, 200);
    } else {
      executeDraw();
    }
  }

  showCardRule(card) {
    const rulePanel = document.getElementById('rulePanel');
    const ruleCardTitle = document.getElementById('ruleCardTitle');
    const ruleName = document.getElementById('ruleName');
    const ruleDesc = document.getElementById('ruleDesc');
    const deckCounter = document.getElementById('deckCounter');

    if (deckCounter) {
      deckCounter.textContent = `${this.deck.length} cartas restantes`;
    }

    if (rulePanel) rulePanel.classList.remove('hidden');
    if (ruleCardTitle) ruleCardTitle.textContent = `${card.name} de ${card.suit} (${card.value})`;
    if (ruleName) ruleName.textContent = card.rule;
    if (ruleDesc) ruleDesc.textContent = card.desc;

    // Alerta do 4º Rei
    if (card.value === 'K') {
      if (this.kingsDrawn >= 4) {
        window.soundFX.playKingAlert();
        window.soundFX.playExplosion();
        const modal = document.getElementById('kingAlertModal');
        if (modal) modal.classList.remove('hidden');
      } else {
        window.soundFX.playShotAlert();
      }
    }
  }

  updateCupVisual() {
    // Atualiza coroas
    const crowns = this.container.querySelectorAll('.king-crown');
    crowns.forEach((crown, index) => {
      if (index < this.kingsDrawn) {
        crown.classList.add('filled');
      } else {
        crown.classList.remove('filled');
      }
    });

    // Atualiza líquido
    const liquidFill = document.getElementById('liquidFill');
    if (liquidFill) {
      const yPos = 160 - (145 * (this.kingsDrawn / 4));
      liquidFill.setAttribute('y', yPos);
    }
  }
}

window.CopoDoReiGame = CopoDoReiGame;
