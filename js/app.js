/**
 * Resenha Party Hub - Controlador Principal da Aplicação (SPA)
 * Roteamento, Gerenciamento de Telas, Modais de Placar e Jogadores.
 */

class AppController {
  constructor() {
    this.currentGameId = null;
    this.currentGameInstance = null;
    this.gameMap = {
      garrafa: window.GarrafaGame,
      provavel: window.ProvavelGame,
      eununca: window.EuNuncaGame,
      copodorei: window.CopoDoReiGame,
      bomba: window.BombaGame,
      natesta: window.NaTestaGame
    };
  }

  init() {
    this.bindHeaderActions();
    this.bindHubCards();
    this.bindScoreboardModal();
    this.bindPlayersModal();
    this.bindGlobalShortcuts();
    this.updateScoreboardTable();
    this.renderPlayersList();
    this.showHub();

    // Reatividade com o estado
    window.ResenhaState.on('scoreChanged', () => {
      this.updateScoreboardTable();
      this.updateHeaderBadge();
    });

    window.ResenhaState.on('playersChanged', () => {
      this.renderPlayersList();
      this.updateHubPlayersCount();
      // Se um jogo estiver aberto e precisar ser re-renderizado
      if (this.currentGameInstance && typeof this.currentGameInstance.render === 'function') {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
          this.currentGameInstance.mount(gameContainer);
        }
      }
    });

    this.updateHeaderBadge();
  }

  // --- NAVEGAÇÃO ENTRE HUB E JOGOS ---
  showHub() {
    // Destrói o jogo anterior e limpa todos os loops
    if (this.currentGameInstance) {
      if (typeof this.currentGameInstance.unmount === 'function') {
        this.currentGameInstance.unmount();
      }
      this.currentGameInstance = null;
    }
    window.ResenhaState.clearAllGameLoops();
    this.currentGameId = null;

    const hubSection = document.getElementById('hubSection');
    const gameSection = document.getElementById('gameSection');
    const btnBackHub = document.getElementById('btnBackHub');

    if (hubSection) hubSection.classList.remove('hidden');
    if (gameSection) gameSection.classList.add('hidden');
    if (btnBackHub) btnBackHub.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  launchGame(gameId) {
    const GameClass = this.gameMap[gameId];
    if (!GameClass) {
      console.error(`Jogo não encontrado: ${gameId}`);
      return;
    }

    // Inicializa Web Audio se necessário
    window.soundFX.init();

    // Destrói instância prévia
    if (this.currentGameInstance) {
      if (typeof this.currentGameInstance.unmount === 'function') {
        this.currentGameInstance.unmount();
      }
    }
    window.ResenhaState.clearAllGameLoops();

    this.currentGameId = gameId;

    const hubSection = document.getElementById('hubSection');
    const gameSection = document.getElementById('gameSection');
    const gameContainer = document.getElementById('gameContainer');
    const btnBackHub = document.getElementById('btnBackHub');

    if (hubSection) hubSection.classList.add('hidden');
    if (gameSection) gameSection.classList.remove('hidden');
    if (btnBackHub) btnBackHub.classList.remove('hidden');

    this.currentGameInstance = new GameClass();
    this.currentGameInstance.mount(gameContainer);

    window.soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- BINDINGS DE INTERFACE ---
  bindHeaderActions() {
    const btnBackHub = document.getElementById('btnBackHub');
    if (btnBackHub) {
      btnBackHub.addEventListener('click', () => this.showHub());
    }

    const btnMute = document.getElementById('btnToggleMute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const isMuted = window.soundFX.toggleMute();
        btnMute.innerHTML = isMuted ? '🔇' : '🔊';
        btnMute.classList.toggle('muted', isMuted);
      });
    }

    const btnScore = document.getElementById('btnOpenScoreboard');
    if (btnScore) {
      btnScore.addEventListener('click', () => this.openModal('scoreModal'));
    }

    const btnFabScore = document.getElementById('fabScore');
    if (btnFabScore) {
      btnFabScore.addEventListener('click', () => this.openModal('scoreModal'));
    }

    const btnPlayers = document.getElementById('btnOpenPlayers');
    if (btnPlayers) {
      btnPlayers.addEventListener('click', () => this.openModal('playersModal'));
    }
  }

  bindHubCards() {
    const cards = document.querySelectorAll('.game-card[data-game]');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const gameId = card.getAttribute('data-game');
        this.launchGame(gameId);
      });
    });
  }

  bindScoreboardModal() {
    const closeBtn = document.getElementById('btnCloseScoreModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal('scoreModal'));
    }

    const resetBtn = document.getElementById('btnResetScores');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja zerar os shots e pontos de todos os jogadores?')) {
          window.ResenhaState.resetScoresOnly();
          window.soundFX.playClick();
        }
      });
    }

    const scoreTable = document.getElementById('scoreboardTableBody');
    if (scoreTable) {
      scoreTable.addEventListener('click', (e) => {
        const btn = e.target.closest('.score-btn');
        if (!btn) return;
        const player = btn.getAttribute('data-player');
        const type = btn.getAttribute('data-type');
        const change = parseInt(btn.getAttribute('data-change'), 10);

        if (player && type === 'shot') {
          window.ResenhaState.addShot(player, change);
        } else if (player && type === 'challenge') {
          window.ResenhaState.addChallenge(player, change);
        } else if (player && type === 'chicken') {
          window.ResenhaState.addChicken(player, change);
        }
      });
    }
  }

  bindPlayersModal() {
    const closeBtn = document.getElementById('btnClosePlayersModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal('playersModal'));
    }

    const addBtn = document.getElementById('btnAddPlayer');
    const input = document.getElementById('inputPlayerName');

    const handleAdd = () => {
      if (!input) return;
      const name = input.value.trim();
      if (name) {
        const success = window.ResenhaState.addPlayer(name);
        if (success) {
          input.value = '';
          window.soundFX.playClick();
        } else {
          alert('Jogador já existe ou nome inválido!');
        }
      }
    };

    if (addBtn) addBtn.addEventListener('click', handleAdd);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAdd();
      });
    }

    const list = document.getElementById('playersListContainer');
    if (list) {
      list.addEventListener('click', (e) => {
        const btnRemove = e.target.closest('.btn-remove-player');
        if (btnRemove) {
          const playerName = btnRemove.getAttribute('data-player');
          if (confirm(`Remover "${playerName}" da resenha?`)) {
            window.ResenhaState.removePlayer(playerName);
            window.soundFX.playClick();
          }
        }
      });
    }
  }

  bindGlobalShortcuts() {
    // Tecla Escape fecha modais
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Clique fora do modal fecha
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }

  // --- ATUALIZAÇÃO DO PLACAR E JOGADORES ---
  updateScoreboardTable() {
    const tbody = document.getElementById('scoreboardTableBody');
    if (!tbody) return;

    const players = window.ResenhaState.getPlayers();
    const scores = window.ResenhaState.scores;

    // Classificação por shots tomados
    const sorted = [...players].sort((a, b) => {
      const shotsA = (scores[a] && scores[a].shots) || 0;
      const shotsB = (scores[b] && scores[b].shots) || 0;
      return shotsB - shotsA;
    });

    tbody.innerHTML = sorted.map((name, index) => {
      const s = scores[name] || { shots: 0, challenges: 0, chickens: 0 };
      
      let badge = '';
      if (index === 0 && s.shots > 0) badge = '👑 Líder do Gole';
      else if (s.chickens >= 3) badge = '🐔 Arregão';
      else if (s.challenges >= 3) badge = '🏆 Destemido';

      return `
        <tr>
          <td>
            <div class="player-cell">
              <strong>${name}</strong>
              ${badge ? `<span class="badge-title">${badge}</span>` : ''}
            </div>
          </td>
          <td>
            <div class="score-adjuster">
              <button class="score-btn minus" data-player="${name}" data-type="shot" data-change="-1">-</button>
              <span class="score-num shots-num">${s.shots} 🥃</span>
              <button class="score-btn plus" data-player="${name}" data-type="shot" data-change="1">+</button>
            </div>
          </td>
          <td>
            <div class="score-adjuster">
              <button class="score-btn minus" data-player="${name}" data-type="challenge" data-change="-1">-</button>
              <span class="score-num challenges-num">${s.challenges} 🏆</span>
              <button class="score-btn plus" data-player="${name}" data-type="challenge" data-change="1">+</button>
            </div>
          </td>
          <td>
            <div class="score-adjuster">
              <button class="score-btn minus" data-player="${name}" data-type="chicken" data-change="-1">-</button>
              <span class="score-num chickens-num">${s.chickens} 🐔</span>
              <button class="score-btn plus" data-player="${name}" data-type="chicken" data-change="1">+</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderPlayersList() {
    const container = document.getElementById('playersListContainer');
    if (!container) return;

    const players = window.ResenhaState.getPlayers();
    container.innerHTML = players.map(name => `
      <div class="player-list-item">
        <span class="player-avatar-small">${name.substring(0, 2).toUpperCase()}</span>
        <span class="player-item-name">${name}</span>
        <button class="btn-remove-player" data-player="${name}" title="Remover jogador" aria-label="Remover jogador">
          🗑️
        </button>
      </div>
    `).join('');
  }

  updateHeaderBadge() {
    const badge = document.getElementById('headerShotsTotal');
    if (!badge) return;

    const scores = window.ResenhaState.scores;
    let totalShots = 0;
    Object.values(scores).forEach(s => {
      totalShots += (s.shots || 0);
    });

    badge.textContent = `${totalShots} 🥃`;
  }

  updateHubPlayersCount() {
    const el = document.getElementById('hubPlayersBadge');
    if (el) {
      const total = window.ResenhaState.getPlayers().length;
      el.textContent = `${total} Jogadores`;
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      window.soundFX.init();
      window.soundFX.playClick();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.add('hidden');
    });
  }
}

// Inicializa no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
