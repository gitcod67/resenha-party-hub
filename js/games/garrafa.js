/**
 * Jogo 1: A Garrafa (Verdade, Desafio ou Consequência)
 * Com física realista de rotação (damping), posicionamento radial dos jogadores
 * e máquina de estados rigorosa (IDLE, IN_PROGRESS, RESOLVED).
 */

class GarrafaGame {
  constructor() {
    this.container = null;
    this.state = 'IDLE'; // IDLE | IN_PROGRESS | RESOLVED
    this.currentAngle = 0;
    this.rafId = null;
    this.failsafeTimer = null;
    this.lastTickAngle = 0;

    // Cartas embaralhadas sem repetição
    this.bagVerdades = new ShuffleBag(window.ResenhaData.garrafa.verdades);
    this.bagDesafios = new ShuffleBag(window.ResenhaData.garrafa.desafios);

    this.currentJuiz = null;
    this.currentVitima = null;
    this.currentCard = null;
    this.currentType = null; // 'verdade' | 'desafio'
  }

  mount(containerEl) {
    this.container = containerEl;
    this.state = 'IDLE';
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
    if (this.rafId) {
      window.ResenhaState.cancelAnimationFrameSafe(this.rafId);
      this.rafId = null;
    }
    if (this.failsafeTimer) {
      window.ResenhaState.clearTimeoutSafe(this.failsafeTimer);
      this.failsafeTimer = null;
    }
    this.state = 'IDLE';
  }

  render() {
    const players = window.ResenhaState.getPlayers();
    
    this.container.innerHTML = `
      <div class="game-view garrafa-view">
        <div class="game-header">
          <h2 class="neon-text-cyan">🍾 A Garrafa</h2>
          <p class="game-subtitle">Toque na garrafa para girar. O gargalo aponta para a Vítima e o fundo para o Juiz!</p>
        </div>

        <!-- Arena da Garrafa com Jogadores Radiais -->
        <div class="bottle-arena-wrapper">
          <div class="bottle-ring" id="bottleRing">
            ${this.renderRadialPlayers(players)}
            
            <!-- Garrafa Central SVG -->
            <div class="bottle-pivot" id="bottlePivot" style="transform: rotate(${this.currentAngle}deg);">
              <svg class="bottle-svg" viewBox="0 0 100 320" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f3ff"/>
                    <stop offset="50%" stop-color="#093b52"/>
                    <stop offset="100%" stop-color="#02141d"/>
                  </linearGradient>
                  <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ff007f"/>
                    <stop offset="100%" stop-color="#00ff88"/>
                  </linearGradient>
                  <filter id="bottleFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#00f3ff" flood-opacity="0.8"/>
                  </filter>
                </defs>
                
                <!-- Gargalo / Tampa (Aponta para 0 graus = Cima / Vítima) -->
                <rect x="42" y="10" width="16" height="25" rx="3" fill="#ff007f" />
                <!-- Anel do gargalo -->
                <rect x="40" y="35" width="20" height="8" rx="2" fill="#ffe600" />
                <!-- Pescoço da Garrafa -->
                <path d="M 40 43 L 40 85 C 40 120 15 135 15 175 L 15 285 C 15 295 25 305 50 305 C 75 305 85 295 85 285 L 85 175 C 85 135 60 120 60 85 L 60 43 Z" 
                      fill="url(#bottleGrad)" stroke="#00f3ff" stroke-width="2.5" filter="url(#bottleFilter)"/>
                <!-- Rótulo Neon -->
                <rect x="23" y="180" width="54" height="65" rx="6" fill="#131424" stroke="url(#neonGlow)" stroke-width="2"/>
                <text x="50" y="208" text-anchor="middle" fill="#00ff88" font-size="12" font-weight="900" letter-spacing="1">RESENHA</text>
                <text x="50" y="226" text-anchor="middle" fill="#ff007f" font-size="9" font-weight="bold">SHOT HUB</text>
                
                <!-- Indicador de Gargalo (Seta Cima) -->
                <polygon points="50,0 43,10 57,10" fill="#00ff88" filter="url(#bottleFilter)"/>
                <!-- Base Indicador (Fundo da Garrafa) -->
                <circle cx="50" cy="305" r="4" fill="#ff007f" />
              </svg>
            </div>

            <!-- Botão central de toque rápido -->
            <button class="bottle-spin-btn ${this.state === 'IN_PROGRESS' ? 'disabled' : ''}" id="spinBottleBtn" aria-label="Girar Garrafa">
              <span>GIRAR</span>
            </button>
          </div>
        </div>

        <!-- Painel de Duelo / Decisão -->
        <div class="duel-panel" id="duelPanel">
          <div class="duel-standby" id="duelStandby">
            <p class="pulse-text">👇 Toque no centro para girar a garrafa!</p>
          </div>

          <div class="duel-active hidden" id="duelActive">
            <div class="duel-participants">
              <div class="duel-card judge-card">
                <span class="role-tag crown-tag">👑 JUIZ</span>
                <strong class="player-name neon-text-yellow" id="judgeName">-</strong>
                <span class="role-desc">Pergunta / Exige</span>
              </div>
              <div class="duel-vs">VS</div>
              <div class="duel-card victim-card">
                <span class="role-tag target-tag">🎯 VÍTIMA</span>
                <strong class="player-name neon-text-pink" id="victimName">-</strong>
                <span class="role-desc">Responde / Bebe</span>
              </div>
            </div>

            <!-- Escolha: Verdade, Desafio ou Arregou -->
            <div class="duel-choices" id="duelChoices">
              <button class="choice-btn truth-btn" id="btnTruth">
                <span class="btn-icon">💬</span>
                <span class="btn-text">Verdade</span>
              </button>
              <button class="choice-btn dare-btn" id="btnDare">
                <span class="btn-icon">🔥</span>
                <span class="btn-text">Desafio</span>
              </button>
              <button class="choice-btn chicken-btn" id="btnChickenImmediate">
                <span class="btn-icon">🐔</span>
                <span class="btn-text">Arregou (Toma Shot)</span>
              </button>
            </div>

            <!-- Exibição da Pergunta/Desafio -->
            <div class="duel-task-box hidden" id="duelTaskBox">
              <div class="task-badge" id="taskBadge">VERDADE</div>
              <p class="task-content" id="taskContent">Carregando pergunta...</p>
              
              <div class="task-actions">
                <button class="action-btn success-btn" id="btnTaskDone">
                  <span>✅ Cumprido!</span>
                </button>
                <button class="action-btn fail-btn" id="btnTaskFailed">
                  <span>🥃 Arregou / Bebe!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRadialPlayers(players) {
    const total = players.length;
    // Raio do anel radial em pixels relativo ao centro de 160x160 (container 320x320)
    const radius = 126;
    const centerX = 160;
    const centerY = 160;
    
    return players.map((name, index) => {
      // Ângulo em radianos e graus (0 graus = topo = 12h)
      const angleDeg = (index / total) * 360;
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      
      const x = Math.round(centerX + radius * Math.cos(angleRad));
      const y = Math.round(centerY + radius * Math.sin(angleRad));

      return `
        <div class="radial-player-node" 
             id="playerNode_${index}" 
             data-index="${index}" 
             data-angle="${angleDeg}"
             data-name="${name}"
             style="left: ${x}px; top: ${y}px;">
          <div class="node-avatar">${name.substring(0, 2).toUpperCase()}</div>
          <span class="node-label">${name}</span>
        </div>
      `;
    }).join('');
  }

  attachEvents() {
    const spinBtn = document.getElementById('spinBottleBtn');
    const pivot = document.getElementById('bottlePivot');

    if (spinBtn) {
      spinBtn.addEventListener('click', () => this.spin());
    }
    if (pivot) {
      pivot.addEventListener('click', () => this.spin());
    }

    const btnTruth = document.getElementById('btnTruth');
    const btnDare = document.getElementById('btnDare');
    const btnChickenImmediate = document.getElementById('btnChickenImmediate');

    if (btnTruth) btnTruth.addEventListener('click', () => this.pickChoice('verdade'));
    if (btnDare) btnDare.addEventListener('click', () => this.pickChoice('desafio'));
    if (btnChickenImmediate) btnChickenImmediate.addEventListener('click', () => this.chickenOut());

    const btnTaskDone = document.getElementById('btnTaskDone');
    const btnTaskFailed = document.getElementById('btnTaskFailed');

    if (btnTaskDone) btnTaskDone.addEventListener('click', () => this.completeTask());
    if (btnTaskFailed) btnTaskFailed.addEventListener('click', () => this.failTask());
  }

  spin() {
    if (this.state === 'IN_PROGRESS') return;

    window.soundFX.init();
    this.cleanup();
    this.state = 'IN_PROGRESS';

    const spinBtn = document.getElementById('spinBottleBtn');
    if (spinBtn) spinBtn.classList.add('disabled');

    // Reseta visual dos participantes anteriores
    document.querySelectorAll('.radial-player-node').forEach(el => {
      el.classList.remove('selected-judge', 'selected-victim');
    });

    // Oculta painel ativo durante o giro
    const duelStandby = document.getElementById('duelStandby');
    const duelActive = document.getElementById('duelActive');
    const duelChoices = document.getElementById('duelChoices');
    const duelTaskBox = document.getElementById('duelTaskBox');

    if (duelStandby) duelStandby.classList.remove('hidden');
    if (duelActive) duelActive.classList.add('hidden');
    if (duelChoices) duelChoices.classList.remove('hidden');
    if (duelTaskBox) duelTaskBox.classList.add('hidden');

    if (duelStandby) {
      duelStandby.innerHTML = `<p class="pulse-text neon-text-pink">🌀 A garrafa está girando...</p>`;
    }

    // Física de Rotação com desaceleração (Damping)
    // Velocidade angular inicial alta e aleatória
    let velocity = 35 + Math.random() * 25; // 35 a 60 graus por frame
    const friction = 0.983; // Fator de desaceleração suave
    const minVelocity = 0.08;
    this.lastTickAngle = this.currentAngle;

    const pivot = document.getElementById('bottlePivot');

    // Failsafe absoluto de 6 segundos para NUNCA travar
    this.failsafeTimer = window.ResenhaState.setTimeoutSafe(() => {
      console.warn('Failsafe acionado na garrafa.');
      this.resolveSpin();
    }, 6000);

    const step = () => {
      if (this.state !== 'IN_PROGRESS') return;

      this.currentAngle = (this.currentAngle + velocity) % 360;
      if (pivot) {
        pivot.style.transform = `rotate(${this.currentAngle}deg)`;
      }

      // Efeito sonoro de clique a cada 40 graus percorridos
      if (Math.abs(this.currentAngle - this.lastTickAngle) > 35) {
        window.soundFX.playClick();
        this.lastTickAngle = this.currentAngle;
      }

      velocity *= friction;

      if (velocity <= minVelocity) {
        this.resolveSpin();
      } else {
        this.rafId = window.ResenhaState.requestAnimationFrameSafe(step);
      }
    };

    this.rafId = window.ResenhaState.requestAnimationFrameSafe(step);
  }

  resolveSpin() {
    this.cleanup();
    this.state = 'RESOLVED';

    const spinBtn = document.getElementById('spinBottleBtn');
    if (spinBtn) spinBtn.classList.remove('disabled');

    // Gargalo aponta para o ângulo exato da garrafa (0 graus = topo)
    const gargaloAngle = (this.currentAngle % 360 + 360) % 360;
    // Base aponta para 180 graus opostos
    const baseAngle = (gargaloAngle + 180) % 360;

    const players = window.ResenhaState.getPlayers();
    const total = players.length;

    // Calcula qual jogador está mais próximo de cada ponta
    const getClosestPlayerIndex = (targetAngle) => {
      let closestIdx = 0;
      let minDiff = 360;

      for (let i = 0; i < total; i++) {
        const playerAngle = (i / total) * 360;
        let diff = Math.abs(targetAngle - playerAngle);
        if (diff > 180) diff = 360 - diff;

        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      return closestIdx;
    };

    let victimIdx = getClosestPlayerIndex(gargaloAngle);
    let judgeIdx = getClosestPlayerIndex(baseAngle);

    // Garante que Juiz e Vítima NUNCA sejam a mesma pessoa
    if (victimIdx === judgeIdx && total > 1) {
      judgeIdx = (victimIdx + Math.floor(total / 2)) % total;
      if (judgeIdx === victimIdx) {
        judgeIdx = (victimIdx + 1) % total;
      }
    }

    this.currentVitima = players[victimIdx];
    this.currentJuiz = players[judgeIdx];

    // Destaque visual nos nós dos jogadores
    const victimNode = document.getElementById(`playerNode_${victimIdx}`);
    const judgeNode = document.getElementById(`playerNode_${judgeIdx}`);

    if (victimNode) victimNode.classList.add('selected-victim');
    if (judgeNode) judgeNode.classList.add('selected-judge');

    window.soundFX.playShotAlert();

    // Exibe painel de duelo
    const duelStandby = document.getElementById('duelStandby');
    const duelActive = document.getElementById('duelActive');
    const judgeName = document.getElementById('judgeName');
    const victimName = document.getElementById('victimName');
    const duelChoices = document.getElementById('duelChoices');
    const duelTaskBox = document.getElementById('duelTaskBox');

    if (duelStandby) duelStandby.classList.add('hidden');
    if (duelActive) duelActive.classList.remove('hidden');
    if (duelChoices) duelChoices.classList.remove('hidden');
    if (duelTaskBox) duelTaskBox.classList.add('hidden');

    if (judgeName) judgeName.textContent = this.currentJuiz;
    if (victimName) victimName.textContent = this.currentVitima;
  }

  pickChoice(type) {
    if (!this.currentVitima || !this.currentJuiz) return;
    this.currentType = type;

    let text = '';
    if (type === 'verdade') {
      text = this.bagVerdades.draw();
    } else {
      text = this.bagDesafios.draw();
    }
    this.currentCard = text;

    window.soundFX.playCardFlip();

    const duelChoices = document.getElementById('duelChoices');
    const duelTaskBox = document.getElementById('duelTaskBox');
    const taskBadge = document.getElementById('taskBadge');
    const taskContent = document.getElementById('taskContent');

    if (duelChoices) duelChoices.classList.add('hidden');
    if (duelTaskBox) duelTaskBox.classList.remove('hidden');

    if (taskBadge) {
      taskBadge.textContent = type === 'verdade' ? '💬 VERDADE' : '🔥 DESAFIO';
      taskBadge.className = `task-badge badge-${type}`;
    }
    if (taskContent) {
      taskContent.textContent = text;
    }
  }

  completeTask() {
    if (!this.currentVitima) return;
    window.ResenhaState.addChallenge(this.currentVitima, 1);
    window.soundFX.playFanfare();
    this.finishRound(`🏆 ${this.currentVitima} cumpriu o desafio com honra!`);
  }

  failTask() {
    if (!this.currentVitima) return;
    window.ResenhaState.addShot(this.currentVitima, 1);
    window.ResenhaState.addChicken(this.currentVitima, 1);
    window.soundFX.playShotAlert();
    this.finishRound(`🐔 ${this.currentVitima} arregou e deve tomar 1 SHOT! 🥃`);
  }

  chickenOut() {
    if (!this.currentVitima) return;
    window.ResenhaState.addShot(this.currentVitima, 1);
    window.ResenhaState.addChicken(this.currentVitima, 1);
    window.soundFX.playShotAlert();
    this.finishRound(`🐔 ${this.currentVitima} arregou imediatamente e toma 1 SHOT! 🥃`);
  }

  finishRound(message) {
    this.state = 'IDLE';
    const duelActive = document.getElementById('duelActive');
    const duelStandby = document.getElementById('duelStandby');

    if (duelActive) duelActive.classList.add('hidden');
    if (duelStandby) {
      duelStandby.classList.remove('hidden');
      duelStandby.innerHTML = `
        <div class="round-result-banner">
          <p class="result-msg">${message}</p>
          <button class="next-round-btn neon-btn-cyan" id="btnNextSpin">🍾 Girar Próxima Rodada</button>
        </div>
      `;
      const nextBtn = document.getElementById('btnNextSpin');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.spin());
      }
    }
  }
}

window.GarrafaGame = GarrafaGame;
