/**
 * Jogo 5: Bomba-Relógio (Tique-Taque / Passa a Bomba)
 * Tempo secreto aleatório (15s a 45s), tique-taque acelerado via Web Audio,
 * botão gigante neon e explosão sintetizada com ruído branco filtrado.
 */

class BombaGame {
  constructor() {
    this.container = null;
    this.bagCategorias = new ShuffleBag(window.ResenhaData.bomba);
    this.state = 'IDLE'; // 'IDLE' | 'IN_PROGRESS' | 'EXPLODED'

    this.currentCategory = '';
    this.currentPlayerIdx = 0;
    
    this.totalDurationMs = 0;
    this.remainingMs = 0;
    this.startTime = 0;
    
    this.tickInterval = null;
    this.bombLoopTimer = null;
    this.failsafeTimer = null;
  }

  mount(containerEl) {
    this.container = containerEl;
    this.state = 'IDLE';
    this.render();
    this.attachEvents();
    this.newRoundSetup();
  }

  unmount() {
    this.cleanup();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  cleanup() {
    if (this.tickInterval) {
      window.ResenhaState.clearTimeoutSafe(this.tickInterval);
      this.tickInterval = null;
    }
    if (this.bombLoopTimer) {
      window.ResenhaState.clearTimeoutSafe(this.bombLoopTimer);
      this.bombLoopTimer = null;
    }
    if (this.failsafeTimer) {
      window.ResenhaState.clearTimeoutSafe(this.failsafeTimer);
      this.failsafeTimer = null;
    }
    this.state = 'IDLE';
  }

  render() {
    this.container.innerHTML = `
      <div class="game-view bomba-view" id="bombaViewWrapper">
        <div class="game-header">
          <h2 class="neon-text-green">💣 Bomba-Relógio</h2>
          <p class="game-subtitle">Fale um item da categoria e passe a bomba antes que o tempo secreto exploda!</p>
        </div>

        <!-- Categoria Sorteada -->
        <div class="category-display-box glow-green">
          <span class="category-tag">CATEGORIA DA RODADA</span>
          <h3 class="category-name" id="bombaCategoryText">Carregando...</h3>
        </div>

        <!-- Visual da Bomba SVG com Pavio e Faísca -->
        <div class="bomb-visual-area">
          <div class="bomb-avatar-wrapper" id="bombAvatarWrapper">
            <svg class="bomb-svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="bombBodyGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#33334d"/>
                  <stop offset="50%" stop-color="#141420"/>
                  <stop offset="100%" stop-color="#07070b"/>
                </radialGradient>
                <filter id="fuseSparkGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffe600"/>
                </filter>
              </defs>

              <!-- Pavio da Bomba -->
              <path d="M 80 40 C 95 15 120 20 130 10" fill="none" stroke="#d4943f" stroke-width="4" stroke-linecap="round"/>
              <!-- Faísca do Pavio -->
              <circle id="fuseSpark" cx="130" cy="10" r="7" fill="#ffe600" filter="url(#fuseSparkGlow)">
                <animate attributeName="r" values="5;9;5" dur="0.2s" repeatCount="indefinite"/>
              </circle>

              <!-- Tampa metálica da bomba -->
              <rect x="70" y="36" width="20" height="8" rx="2" fill="#777" />

              <!-- Esfera da Bomba -->
              <circle cx="80" cy="95" r="55" fill="url(#bombBodyGrad)" stroke="#00ff88" stroke-width="3"/>

              <!-- Caveira / Emoji central -->
              <text x="80" y="105" text-anchor="middle" font-size="28" id="bombFace">💣</text>
            </svg>
          </div>

          <!-- Indicador de Quem está com a Bomba -->
          <div class="bomb-holder-indicator" id="bombHolderBox">
            <span class="holder-label">A bomba está na mão de:</span>
            <strong class="holder-name neon-text-yellow" id="bombHolderName">-</strong>
          </div>
        </div>

        <!-- Botões de Controle -->
        <div class="bomb-controls">
          <button class="start-bomb-btn neon-btn-pink" id="btnStartBomb">
            <span>🔥 ACENDER O PAVIO & INICIAR!</span>
          </button>

          <!-- Botão Gigante Passa a Bomba -->
          <button class="pass-bomb-btn neon-btn-green hidden" id="btnPassBomb">
            <span class="pass-text">💥 PASSA A BOMBA!</span>
            <span class="pass-sub">Toque rápido e passe o celular!</span>
          </button>
        </div>

        <!-- Modal de Explosão -->
        <div class="explosion-modal hidden" id="explosionModal">
          <div class="explosion-content">
            <div class="boom-badge">💥 KABOOOM! 💥</div>
            <h2 class="explosion-title neon-text-pink">A BOMBA EXPLODIU!</h2>
            <p class="explosion-victim">
              Explodiu na mão de: <br/>
              <strong class="victim-highlight" id="explosionVictimName">-</strong>
            </p>
            <p class="explosion-punishment">Penalidade: <strong>1 SHOT IMEDIATO! 🥃</strong></p>
            
            <button class="new-round-btn neon-btn-cyan" id="btnNewBombRound">
              <span>💣 Nova Rodada de Bomba</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const btnStart = document.getElementById('btnStartBomb');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.startBomb());
    }

    const btnPass = document.getElementById('btnPassBomb');
    if (btnPass) {
      btnPass.addEventListener('click', () => this.passBomb());
    }

    const btnNewRound = document.getElementById('btnNewBombRound');
    if (btnNewRound) {
      btnNewRound.addEventListener('click', () => {
        const modal = document.getElementById('explosionModal');
        if (modal) modal.classList.add('hidden');
        this.newRoundSetup();
      });
    }
  }

  newRoundSetup() {
    this.cleanup();
    this.state = 'IDLE';

    this.currentCategory = this.bagCategorias.draw();
    const catText = document.getElementById('bombaCategoryText');
    if (catText) catText.textContent = this.currentCategory;

    const players = window.ResenhaState.getPlayers();
    this.currentPlayerIdx = Math.floor(Math.random() * players.length);
    const holderName = document.getElementById('bombHolderName');
    if (holderName) holderName.textContent = players[this.currentPlayerIdx];

    const btnStart = document.getElementById('btnStartBomb');
    const btnPass = document.getElementById('btnPassBomb');
    const face = document.getElementById('bombFace');
    const wrapper = document.getElementById('bombaViewWrapper');

    if (btnStart) btnStart.classList.remove('hidden');
    if (btnPass) btnPass.classList.add('hidden');
    if (face) face.textContent = '💣';
    if (wrapper) wrapper.classList.remove('screen-shake', 'flash-red');
  }

  startBomb() {
    if (this.state === 'IN_PROGRESS') return;
    this.state = 'IN_PROGRESS';

    window.soundFX.init();

    // Sorteia tempo secreto entre 15 e 45 segundos (15000 a 45000 ms)
    this.totalDurationMs = Math.floor(Math.random() * 30000) + 15000;
    this.remainingMs = this.totalDurationMs;
    this.startTime = Date.now();

    const btnStart = document.getElementById('btnStartBomb');
    const btnPass = document.getElementById('btnPassBomb');
    const face = document.getElementById('bombFace');

    if (btnStart) btnStart.classList.add('hidden');
    if (btnPass) btnPass.classList.remove('hidden');
    if (face) face.textContent = '⏱️';

    // Failsafe absoluto de 50 segundos
    this.failsafeTimer = window.ResenhaState.setTimeoutSafe(() => {
      this.explode();
    }, 50000);

    // Inicia ciclo de tique-taque progressivo acelerado
    this.scheduleNextTick();
  }

  scheduleNextTick() {
    if (this.state !== 'IN_PROGRESS') return;

    const elapsed = Date.now() - this.startTime;
    this.remainingMs = Math.max(0, this.totalDurationMs - elapsed);

    if (this.remainingMs <= 0) {
      this.explode();
      return;
    }

    // Progresso de 0 (início) a 1 (fim iminente)
    const progress = 1 - (this.remainingMs / this.totalDurationMs);

    // Frequência do tick varia de 400Hz até 1000Hz conforme o tempo aperta
    const freq = 400 + progress * 600;
    window.soundFX.playTick(freq, 0.03);

    // Intervalo de tique-taque encurta de 900ms para 110ms
    const nextInterval = Math.max(100, 900 - Math.pow(progress, 1.8) * 800);

    this.tickInterval = window.ResenhaState.setTimeoutSafe(() => {
      this.scheduleNextTick();
    }, nextInterval);
  }

  passBomb() {
    if (this.state !== 'IN_PROGRESS') return;

    const players = window.ResenhaState.getPlayers();
    this.currentPlayerIdx = (this.currentPlayerIdx + 1) % players.length;

    const holderName = document.getElementById('bombHolderName');
    if (holderName) {
      holderName.textContent = players[this.currentPlayerIdx];
    }

    // Efeito visual de pulso e som rápido de confirmação
    const btnPass = document.getElementById('btnPassBomb');
    if (btnPass) {
      btnPass.classList.add('btn-thump');
      window.ResenhaState.setTimeoutSafe(() => btnPass.classList.remove('btn-thump'), 150);
    }
    window.soundFX.playClick();
  }

  explode() {
    this.cleanup();
    this.state = 'EXPLODED';

    const players = window.ResenhaState.getPlayers();
    const victim = players[this.currentPlayerIdx];

    // Computa shot no placar global
    window.ResenhaState.addShot(victim, 1);

    // Áudio de explosão devastadora sintetizada
    window.soundFX.playExplosion();

    // Efeitos visuais de choque / tremor na tela
    const wrapper = document.getElementById('bombaViewWrapper');
    if (wrapper) {
      wrapper.classList.add('screen-shake', 'flash-red');
    }

    const modal = document.getElementById('explosionModal');
    const victimName = document.getElementById('explosionVictimName');
    const face = document.getElementById('bombFace');

    if (face) face.textContent = '💥';
    if (victimName) victimName.textContent = victim;
    if (modal) modal.classList.remove('hidden');
  }
}

window.BombaGame = BombaGame;
