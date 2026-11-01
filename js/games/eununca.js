/**
 * Jogo 3: Eu Nunca (Never Have I Ever)
 * Sistema de 5 vidas por jogador, botões rápidos de penalidade e eliminação coletiva.
 */

class EuNuncaGame {
  constructor() {
    this.container = null;
    this.currentCategory = 'geral'; // 'geral' | 'relacionamentos' | 'vergonha' | 'extremo'
    this.bags = {
      geral: new ShuffleBag(window.ResenhaData.eununca.geral),
      relacionamentos: new ShuffleBag(window.ResenhaData.eununca.relacionamentos),
      vergonha: new ShuffleBag(window.ResenhaData.eununca.vergonha),
      extremo: new ShuffleBag(window.ResenhaData.eununca.extremo)
    };
    this.currentStatement = '';
    this.lives = {}; // { 'Jogador': 5 }
    this.initLives();
  }

  initLives() {
    const players = window.ResenhaState.getPlayers();
    players.forEach(p => {
      if (this.lives[p] === undefined) {
        this.lives[p] = 5;
      }
    });
  }

  mount(containerEl) {
    this.container = containerEl;
    this.initLives();
    this.render();
    this.attachEvents();
    this.nextCard();
  }

  unmount() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="game-view eununca-view">
        <div class="game-header">
          <h2 class="neon-text-pink">🙅 Eu Nunca</h2>
          <p class="game-subtitle">Quem já fez a ação dita toma 1 shot e perde 1 vida! Quem zerar toma castigo coletivo!</p>
        </div>

        <!-- Seletor de Categorias -->
        <div class="category-pills">
          <button class="pill-btn ${this.currentCategory === 'geral' ? 'active' : ''}" data-cat="geral">
            🌟 Geral
          </button>
          <button class="pill-btn ${this.currentCategory === 'relacionamentos' ? 'active' : ''}" data-cat="relacionamentos">
            💘 Relacionamentos
          </button>
          <button class="pill-btn ${this.currentCategory === 'vergonha' ? 'active' : ''}" data-cat="vergonha">
            🙈 Vergonha Alheia
          </button>
          <button class="pill-btn ${this.currentCategory === 'extremo' ? 'active' : ''}" data-cat="extremo">
            🔥 Extremo (+18)
          </button>
        </div>

        <!-- Card da Frase -->
        <div class="statement-card glow-pink" id="statementCard">
          <span class="card-badge badge-eununca" id="eununcaBadge">GERAL</span>
          <h3 class="statement-text" id="statementText">Carregando...</h3>
        </div>

        <!-- Próxima Carta & Resetar Vidas -->
        <div class="eununca-controls">
          <button class="next-card-btn neon-btn-cyan" id="btnNextStatement">
            <span>Próxima Afirmação ➡️</span>
          </button>
          <button class="reset-lives-btn" id="btnResetLives" title="Reiniciar vidas de todos">
            🔄 Reiniciar Vidas (5 ❤️)
          </button>
        </div>

        <!-- Painel de Jogadores e Vidas -->
        <div class="lives-panel">
          <h4 class="lives-title">Jogadores Ativos & Vidas</h4>
          <div class="player-lives-grid" id="playerLivesGrid">
            ${this.renderPlayerCards()}
          </div>
        </div>
      </div>
    `;
  }

  renderPlayerCards() {
    const players = window.ResenhaState.getPlayers();
    return players.map(name => {
      const life = this.lives[name] !== undefined ? this.lives[name] : 5;
      const isEliminated = life <= 0;

      // Renderiza os corações
      let heartsHtml = '';
      for (let i = 0; i < 5; i++) {
        if (i < life) {
          heartsHtml += '<span class="heart active">❤️</span>';
        } else {
          heartsHtml += '<span class="heart dead">🖤</span>';
        }
      }

      return `
        <div class="player-life-card ${isEliminated ? 'eliminated' : ''}" id="lifeCard_${name}">
          <div class="life-card-header">
            <span class="player-card-name">${name}</span>
            <div class="hearts-wrapper">${heartsHtml}</div>
          </div>
          
          ${isEliminated ? `
            <div class="eliminated-badge">
              <span>💀 ELIMINADO!</span>
              <small>Punição: Vira o copo!</small>
            </div>
          ` : `
            <button class="btn-eu-ja" data-player="${name}">
              <span>🙋 Eu Já! (-1❤️ +1🥃)</span>
            </button>
          `}
        </div>
      `;
    }).join('');
  }

  attachEvents() {
    // Categorias
    const pills = this.container.querySelectorAll('.pill-btn');
    pills.forEach(p => {
      p.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-cat');
        this.setCategory(cat);
      });
    });

    // Próxima afirmação
    const btnNext = document.getElementById('btnNextStatement');
    if (btnNext) {
      btnNext.addEventListener('click', () => this.nextCard());
    }

    // Resetar vidas
    const btnReset = document.getElementById('btnResetLives');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetLives());
    }

    // Botões Eu Já
    this.attachEuJaEvents();
  }

  attachEuJaEvents() {
    const grid = document.getElementById('playerLivesGrid');
    if (grid) {
      grid.onclick = (e) => {
        const btn = e.target.closest('.btn-eu-ja');
        if (btn) {
          const playerName = btn.getAttribute('data-player');
          this.handleEuJa(playerName);
        }
      };
    }
  }

  setCategory(cat) {
    this.currentCategory = cat;
    const pills = this.container.querySelectorAll('.pill-btn');
    pills.forEach(p => {
      if (p.getAttribute('data-cat') === cat) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    const badge = document.getElementById('eununcaBadge');
    if (badge) {
      const labels = {
        geral: 'GERAL',
        relacionamentos: 'RELACIONAMENTOS',
        vergonha: 'VERGONHA ALHEIA',
        extremo: 'EXTREMO (+18)'
      };
      badge.textContent = labels[cat] || 'GERAL';
    }

    this.nextCard();
  }

  nextCard() {
    const bag = this.bags[this.currentCategory];
    this.currentStatement = bag.draw();

    const textEl = document.getElementById('statementText');
    if (textEl) {
      textEl.textContent = this.currentStatement;
    }

    window.soundFX.playCardFlip();
  }

  handleEuJa(playerName) {
    if (this.lives[playerName] > 0) {
      this.lives[playerName]--;
      window.ResenhaState.addShot(playerName, 1);

      if (this.lives[playerName] === 0) {
        // Alerta de eliminação
        window.soundFX.playExplosion();
      } else {
        window.soundFX.playShotAlert();
      }

      this.updateLivesDisplay();
    }
  }

  updateLivesDisplay() {
    const grid = document.getElementById('playerLivesGrid');
    if (grid) {
      grid.innerHTML = this.renderPlayerCards();
    }
  }

  resetLives() {
    const players = window.ResenhaState.getPlayers();
    players.forEach(p => {
      this.lives[p] = 5;
    });
    this.updateLivesDisplay();
    window.soundFX.playFanfare();
  }
}

window.EuNuncaGame = EuNuncaGame;
