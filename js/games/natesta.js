/**
 * Jogo 6: Quem Sou Eu? (Modo "Na Testa" / Heads Up)
 * Tipografia gigante em alto contraste legível a 2 metros,
 * tela dividida (Verde: Acertou / Vermelho: Passou), cronômetro de 60s
 * e resumo da rodada com pontuação.
 */

class NaTestaGame {
  constructor() {
    this.container = null;
    this.currentCategory = 'memes_br';
    this.selectedPlayer = null;
    
    this.state = 'SETUP'; // 'SETUP' | 'COUNTDOWN' | 'PLAYING' | 'SUMMARY'
    this.timerSeconds = 60;
    this.intervalId = null;
    this.countdownId = null;

    this.wordsBag = null;
    this.currentWord = '';
    this.guessedWords = [];
    this.passedWords = [];
  }

  mount(containerEl) {
    this.container = containerEl;
    this.state = 'SETUP';
    this.initCategoryBag();
    this.render();
    this.attachEvents();
  }

  unmount() {
    this.cleanup();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  cleanup() {
    if (this.intervalId) {
      window.ResenhaState.clearIntervalSafe(this.intervalId);
      this.intervalId = null;
    }
    if (this.countdownId) {
      window.ResenhaState.clearIntervalSafe(this.countdownId);
      this.countdownId = null;
    }
    this.state = 'SETUP';
  }

  initCategoryBag() {
    const list = window.ResenhaData.naTesta[this.currentCategory] || window.ResenhaData.naTesta.memes_br;
    this.wordsBag = new ShuffleBag(list);
  }

  render() {
    const players = window.ResenhaState.getPlayers();
    if (!this.selectedPlayer) {
      this.selectedPlayer = players[0] || 'Jogador';
    }

    this.container.innerHTML = `
      <div class="game-view natesta-view" id="naTestaMainView">
        <!-- SETUP VIEW -->
        <div class="natesta-setup ${this.state !== 'SETUP' ? 'hidden' : ''}" id="naTestaSetup">
          <div class="game-header">
            <h2 class="neon-text-cyan">🙆 Modo "Na Testa" (Heads Up)</h2>
            <p class="game-subtitle">Coloque o celular na horizontal na testa. Os amigos dão dicas e você adivinha!</p>
          </div>

          <!-- Seleção do Jogador da Vez -->
          <div class="setup-card">
            <label class="setup-label">Quem vai colocar na testa?</label>
            <div class="player-select-chips" id="playerSelectChips">
              ${players.map(name => `
                <button class="player-chip-btn ${name === this.selectedPlayer ? 'active' : ''}" data-player="${name}">
                  ${name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Seleção de Categoria -->
          <div class="setup-card">
            <label class="setup-label">Escolha o Tema:</label>
            <div class="category-grid">
              <button class="theme-card-btn ${this.currentCategory === 'memes_br' ? 'active' : ''}" data-cat="memes_br">
                <span class="theme-icon">🇧🇷</span>
                <span class="theme-title">Memes & Figuras BR</span>
              </button>
              <button class="theme-card-btn ${this.currentCategory === 'games_anime' ? 'active' : ''}" data-cat="games_anime">
                <span class="theme-icon">🎮</span>
                <span class="theme-title">Animes & Games</span>
              </button>
              <button class="theme-card-btn ${this.currentCategory === 'filmes_series' ? 'active' : ''}" data-cat="filmes_series">
                <span class="theme-icon">🎬</span>
                <span class="theme-title">Filmes & Séries</span>
              </button>
              <button class="theme-card-btn ${this.currentCategory === 'comidas_objetos' ? 'active' : ''}" data-cat="comidas_objetos">
                <span class="theme-icon">🍕</span>
                <span class="theme-title">Comidas & Coisas</span>
              </button>
              <button class="theme-card-btn ${this.currentCategory === 'caos' ? 'active' : ''}" data-cat="caos">
                <span class="theme-icon">🎲</span>
                <span class="theme-title">Modo Caos Total</span>
              </button>
            </div>
          </div>

          <!-- Botão Começar -->
          <div class="setup-action">
            <button class="start-heads-btn neon-btn-pink" id="btnStartHeadsUp">
              <span>🚀 PREPARAR & JOGAR!</span>
            </button>
          </div>
        </div>

        <!-- TELA DE PREPARAÇÃO / CONTAGEM 3s -->
        <div class="prep-screen hidden" id="prepScreen">
          <div class="prep-content">
            <h2 class="prep-title neon-text-yellow">COLOQUE NA TESTA!</h2>
            <p class="prep-sub">Vire a tela na horizontal para os seus amigos verem</p>
            <div class="prep-number" id="prepCount">3</div>
          </div>
        </div>

        <!-- TELA DE JOGO HORIZONTAL / FULL VIEW -->
        <div class="heads-play-screen hidden" id="headsPlayScreen">
          <!-- Barra superior de status & tempo -->
          <div class="heads-top-bar">
            <div class="heads-player-tag">Vez de: <strong id="headsPlayerName">${this.selectedPlayer}</strong></div>
            <div class="heads-timer-box" id="headsTimerBox">
              <span class="timer-digits" id="headsTimerDigits">60</span>s
            </div>
            <div class="heads-score-live">Acertos: <strong id="headsLiveScore" class="neon-text-green">0</strong></div>
          </div>

          <!-- Palavra Gigante no Centro -->
          <div class="heads-word-container">
            <h1 class="heads-big-word" id="headsBigWord">PALAVRA</h1>
          </div>

          <!-- Botões Gigantes Divididos: Esquerda (Passar) / Direita (Acertar) -->
          <div class="heads-touch-split">
            <button class="split-side split-pass" id="btnHeadsPass" aria-label="Passar Palavra">
              <span class="split-icon">❌</span>
              <span class="split-label">PASSOU</span>
            </button>
            <button class="split-side split-hit" id="btnHeadsHit" aria-label="Acertou Palavra">
              <span class="split-icon">✅</span>
              <span class="split-label">ACERTOU!</span>
            </button>
          </div>
        </div>

        <!-- RESUMO DA RODADA -->
        <div class="heads-summary-screen hidden" id="headsSummaryScreen">
          <div class="summary-card">
            <h2 class="summary-title neon-text-yellow">TEMPO ESGOTADO!</h2>
            <div class="summary-score-hero">
              <span class="hero-num" id="summaryScoreNum">0</span>
              <span class="hero-label">Palavras Acertadas!</span>
            </div>

            <div class="summary-lists">
              <div class="summary-col col-hits">
                <h4>✅ Acertou (<span id="countHits">0</span>)</h4>
                <ul id="listHits"></ul>
              </div>
              <div class="summary-col col-passes">
                <h4>❌ Pulou (<span id="countPasses">0</span>)</h4>
                <ul id="listPasses"></ul>
              </div>
            </div>

            <div class="summary-actions">
              <button class="action-btn success-btn" id="btnSaveHeadsScore">
                <span>🏆 Salvar Desafios no Placar</span>
              </button>
              <button class="action-btn fail-btn" id="btnPunishPasses">
                <span>🥃 Pagar Shot pelos Erros</span>
              </button>
              <button class="action-btn neon-btn-cyan" id="btnPlayAgainHeads">
                <span>🔄 Jogar Novamente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Escolha do jogador
    const chipBox = document.getElementById('playerSelectChips');
    if (chipBox) {
      chipBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.player-chip-btn');
        if (btn) {
          chipBox.querySelectorAll('.player-chip-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedPlayer = btn.getAttribute('data-player');
        }
      });
    }

    // Escolha da categoria
    const themeBtns = this.container.querySelectorAll('.theme-card-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-cat');
        this.initCategoryBag();
      });
    });

    // Iniciar
    const btnStart = document.getElementById('btnStartHeadsUp');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.startPrepCountdown());
    }

    // Ações de jogo
    const btnHit = document.getElementById('btnHeadsHit');
    const btnPass = document.getElementById('btnHeadsPass');

    if (btnHit) btnHit.addEventListener('click', () => this.handleHit());
    if (btnPass) btnPass.addEventListener('click', () => this.handlePass());

    // Ações do resumo
    const btnSave = document.getElementById('btnSaveHeadsScore');
    const btnPunish = document.getElementById('btnPunishPasses');
    const btnAgain = document.getElementById('btnPlayAgainHeads');

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        if (this.selectedPlayer && this.guessedWords.length > 0) {
          window.ResenhaState.addChallenge(this.selectedPlayer, this.guessedWords.length);
          alert(`🎉 ${this.guessedWords.length} Desafios/Acertos somados para ${this.selectedPlayer}!`);
        }
      });
    }

    if (btnPunish) {
      btnPunish.addEventListener('click', () => {
        if (this.selectedPlayer) {
          const shots = Math.max(1, Math.floor(this.passedWords.length / 2));
          window.ResenhaState.addShot(this.selectedPlayer, shots);
          window.soundFX.playShotAlert();
          alert(`🥃 ${shots} Shot(s) computado(s) para ${this.selectedPlayer}!`);
        }
      });
    }

    if (btnAgain) {
      btnAgain.addEventListener('click', () => {
        this.state = 'SETUP';
        this.render();
        this.attachEvents();
      });
    }
  }

  startPrepCountdown() {
    window.soundFX.init();
    this.cleanup();
    this.state = 'COUNTDOWN';

    const setup = document.getElementById('naTestaSetup');
    const prep = document.getElementById('prepScreen');
    const prepCount = document.getElementById('prepCount');

    if (setup) setup.classList.add('hidden');
    if (prep) prep.classList.remove('hidden');

    let count = 3;
    if (prepCount) prepCount.textContent = count;
    window.soundFX.playCountdown(count);

    this.countdownId = window.ResenhaState.setIntervalSafe(() => {
      count--;
      if (count > 0) {
        if (prepCount) prepCount.textContent = count;
        window.soundFX.playCountdown(count);
      } else if (count === 0) {
        if (prepCount) prepCount.textContent = 'VAI!';
        window.soundFX.playCountdown(0);
      } else {
        window.ResenhaState.clearIntervalSafe(this.countdownId);
        this.countdownId = null;
        if (prep) prep.classList.add('hidden');
        this.startGameSession();
      }
    }, 1000);
  }

  startGameSession() {
    this.state = 'PLAYING';
    this.timerSeconds = 60;
    this.guessedWords = [];
    this.passedWords = [];

    const playScreen = document.getElementById('headsPlayScreen');
    const playerNameEl = document.getElementById('headsPlayerName');
    const liveScoreEl = document.getElementById('headsLiveScore');
    const timerDigits = document.getElementById('headsTimerDigits');

    if (playScreen) playScreen.classList.remove('hidden');
    if (playerNameEl) playerNameEl.textContent = this.selectedPlayer;
    if (liveScoreEl) liveScoreEl.textContent = '0';
    if (timerDigits) timerDigits.textContent = '60';

    this.nextWord();

    // Inicia cronômetro de 60 segundos
    this.intervalId = window.ResenhaState.setIntervalSafe(() => {
      this.timerSeconds--;
      
      const timerDigits = document.getElementById('headsTimerDigits');
      const timerBox = document.getElementById('headsTimerBox');

      if (timerDigits) timerDigits.textContent = this.timerSeconds;

      // Alerta nos últimos 10 segundos
      if (this.timerSeconds <= 10 && this.timerSeconds > 0) {
        if (timerBox) timerBox.classList.add('urgent-pulse');
        window.soundFX.playBeep(700, 0.08, 'sawtooth', 0.2);
      }

      if (this.timerSeconds <= 0) {
        this.endGameSession();
      }
    }, 1000);
  }

  nextWord() {
    this.currentWord = this.wordsBag.draw();
    const wordEl = document.getElementById('headsBigWord');
    if (wordEl) {
      wordEl.textContent = this.currentWord;
    }
  }

  handleHit() {
    if (this.state !== 'PLAYING') return;

    this.guessedWords.push(this.currentWord);
    window.soundFX.playCorrect();

    const liveScoreEl = document.getElementById('headsLiveScore');
    if (liveScoreEl) liveScoreEl.textContent = this.guessedWords.length;

    // Flash verde visual
    const wordEl = document.getElementById('headsBigWord');
    if (wordEl) {
      wordEl.classList.add('flash-hit');
      window.ResenhaState.setTimeoutSafe(() => wordEl.classList.remove('flash-hit'), 200);
    }

    this.nextWord();
  }

  handlePass() {
    if (this.state !== 'PLAYING') return;

    this.passedWords.push(this.currentWord);
    window.soundFX.playPass();

    // Flash vermelho visual
    const wordEl = document.getElementById('headsBigWord');
    if (wordEl) {
      wordEl.classList.add('flash-pass');
      window.ResenhaState.setTimeoutSafe(() => wordEl.classList.remove('flash-pass'), 200);
    }

    this.nextWord();
  }

  endGameSession() {
    this.cleanup();
    this.state = 'SUMMARY';

    window.soundFX.playFanfare();

    const playScreen = document.getElementById('headsPlayScreen');
    const summaryScreen = document.getElementById('headsSummaryScreen');

    if (playScreen) playScreen.classList.add('hidden');
    if (summaryScreen) summaryScreen.classList.remove('hidden');

    const scoreNum = document.getElementById('summaryScoreNum');
    const countHits = document.getElementById('countHits');
    const countPasses = document.getElementById('countPasses');
    const listHits = document.getElementById('listHits');
    const listPasses = document.getElementById('listPasses');

    if (scoreNum) scoreNum.textContent = this.guessedWords.length;
    if (countHits) countHits.textContent = this.guessedWords.length;
    if (countPasses) countPasses.textContent = this.passedWords.length;

    if (listHits) {
      listHits.innerHTML = this.guessedWords.map(w => `<li>${w}</li>`).join('') || '<li>Nenhuma</li>';
    }
    if (listPasses) {
      listPasses.innerHTML = this.passedWords.map(w => `<li>${w}</li>`).join('') || '<li>Nenhuma</li>';
    }
  }
}

window.NaTestaGame = NaTestaGame;
