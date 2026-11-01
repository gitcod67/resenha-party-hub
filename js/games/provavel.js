/**
 * Jogo 2: Quem é Mais Provável? (Most Likely To)
 * Votação sincronizada com contagem 3..2..1.. APONTEM! e pontuação de shot.
 */

class ProvavelGame {
  constructor() {
    this.container = null;
    this.currentLevel = 'resenha'; // 'suave' | 'resenha' | 'proibido'
    this.bags = {
      suave: new ShuffleBag(window.ResenhaData.provavel.suave),
      resenha: new ShuffleBag(window.ResenhaData.provavel.resenha),
      proibido: new ShuffleBag(window.ResenhaData.provavel.proibido)
    };
    this.currentQuestion = '';
    this.countdownTimer = null;
    this.isVoting = false;
  }

  mount(containerEl) {
    this.container = containerEl;
    this.render();
    this.attachEvents();
    this.nextQuestion();
  }

  unmount() {
    this.cleanup();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  cleanup() {
    if (this.countdownTimer) {
      window.ResenhaState.clearIntervalSafe(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.isVoting = false;
  }

  render() {
    this.container.innerHTML = `
      <div class="game-view provavel-view">
        <div class="game-header">
          <h2 class="neon-text-purple">👉 Quem é Mais Provável?</h2>
          <p class="game-subtitle">Leia a pergunta, inicie a contagem regressiva e todos apontem juntos!</p>
        </div>

        <!-- Filtros de Categoria -->
        <div class="category-pills">
          <button class="pill-btn ${this.currentLevel === 'suave' ? 'active' : ''}" data-level="suave">
            🟢 Suave
          </button>
          <button class="pill-btn ${this.currentLevel === 'resenha' ? 'active' : ''}" data-level="resenha">
            🟣 Resenha Pura
          </button>
          <button class="pill-btn ${this.currentLevel === 'proibido' ? 'active' : ''}" data-level="proibido">
            🔞 Proibido (+18)
          </button>
        </div>

        <!-- Card Principal da Pergunta -->
        <div class="question-card glow-purple" id="questionCard">
          <span class="card-badge" id="cardBadge">RESENHA PURA</span>
          <h3 class="question-text" id="questionText">Carregando pergunta...</h3>
        </div>

        <!-- Área de Contagem e Ação -->
        <div class="vote-action-area">
          <button class="start-vote-btn neon-btn-pink" id="btnStartVote">
            <span class="btn-icon">⏱️</span>
            <span>INICIAR VOTAÇÃO (3s)</span>
          </button>
          
          <div class="countdown-overlay hidden" id="countdownOverlay">
            <div class="countdown-number" id="countdownNumber">3</div>
          </div>
        </div>

        <!-- Seletor de Vítima (Quem foi o mais votado?) -->
        <div class="vote-result-section hidden" id="voteResultSection">
          <h4 class="section-title">Quem recebeu a maioria dos votos?</h4>
          <p class="section-sub">Selecione quem vai tomar a dose:</p>
          <div class="player-vote-chips" id="playerVoteChips">
            ${this.renderPlayerChips()}
          </div>
          
          <div class="feedback-msg hidden" id="voteFeedback"></div>

          <button class="next-card-btn neon-btn-cyan" id="btnNextQuestion">
            <span>Próxima Pergunta ➡️</span>
          </button>
        </div>
      </div>
    `;
  }

  renderPlayerChips() {
    const players = window.ResenhaState.getPlayers();
    return players.map(name => `
      <button class="player-chip-btn" data-player="${name}">
        <span class="chip-avatar">${name.substring(0, 2).toUpperCase()}</span>
        <span class="chip-name">${name}</span>
        <span class="chip-shot">+1 🥃</span>
      </button>
    `).join('');
  }

  attachEvents() {
    // Troca de nível
    const pills = this.container.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const level = e.currentTarget.getAttribute('data-level');
        this.setLevel(level);
      });
    });

    // Iniciar votação
    const btnStart = document.getElementById('btnStartVote');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.startCountdown());
    }

    // Próxima pergunta
    const btnNext = document.getElementById('btnNextQuestion');
    if (btnNext) {
      btnNext.addEventListener('click', () => this.nextQuestion());
    }

    // Votação nos jogadores
    const chipsContainer = document.getElementById('playerVoteChips');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.player-chip-btn');
        if (btn) {
          const playerName = btn.getAttribute('data-player');
          this.applyPenalty(playerName);
        }
      });
    }
  }

  setLevel(level) {
    this.currentLevel = level;
    const pills = this.container.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
      if (pill.getAttribute('data-level') === level) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    const badge = document.getElementById('cardBadge');
    if (badge) {
      const labels = { suave: 'SUAVE', resenha: 'RESENHA PURA', proibido: 'PROIBIDO (+18)' };
      badge.textContent = labels[level] || 'RESENHA';
    }

    this.nextQuestion();
  }

  nextQuestion() {
    this.cleanup();
    const bag = this.bags[this.currentLevel];
    this.currentQuestion = bag.draw();

    const qText = document.getElementById('questionText');
    if (qText) {
      qText.textContent = this.currentQuestion;
    }

    // Reseta visual dos botões
    const btnStart = document.getElementById('btnStartVote');
    const voteResult = document.getElementById('voteResultSection');
    const feedback = document.getElementById('voteFeedback');

    if (btnStart) {
      btnStart.classList.remove('hidden');
      btnStart.disabled = false;
    }
    if (voteResult) voteResult.classList.add('hidden');
    if (feedback) feedback.classList.add('hidden');

    window.soundFX.playCardFlip();
  }

  startCountdown() {
    if (this.isVoting) return;
    this.isVoting = true;

    window.soundFX.init();

    const overlay = document.getElementById('countdownOverlay');
    const countNum = document.getElementById('countdownNumber');
    const btnStart = document.getElementById('btnStartVote');

    if (btnStart) btnStart.disabled = true;
    if (overlay) overlay.classList.remove('hidden');

    let count = 3;
    if (countNum) countNum.textContent = count;
    window.soundFX.playCountdown(count);

    this.countdownTimer = window.ResenhaState.setIntervalSafe(() => {
      count--;
      if (count > 0) {
        if (countNum) countNum.textContent = count;
        window.soundFX.playCountdown(count);
      } else if (count === 0) {
        if (countNum) {
          countNum.innerHTML = '👉 APONTEM!';
          countNum.classList.add('pulse-apontem');
        }
        window.soundFX.playCountdown(0);
      } else {
        // Finaliza contagem
        this.cleanup();
        if (overlay) overlay.classList.add('hidden');
        if (countNum) countNum.classList.remove('pulse-apontem');
        if (btnStart) btnStart.classList.add('hidden');

        const voteResult = document.getElementById('voteResultSection');
        if (voteResult) voteResult.classList.remove('hidden');
      }
    }, 1000);
  }

  applyPenalty(playerName) {
    window.ResenhaState.addShot(playerName, 1);
    window.soundFX.playShotAlert();

    const feedback = document.getElementById('voteFeedback');
    if (feedback) {
      feedback.classList.remove('hidden');
      feedback.innerHTML = `🚨 <strong>${playerName}</strong> tomou a maioria dos votos e bebeu <strong>1 SHOT! 🥃</strong>`;
    }
  }
}

window.ProvavelGame = ProvavelGame;
