/**
 * Gerenciamento de Estado Global, Persistência e Limpeza de Ciclo de Vida
 */

class StateManager {
  constructor() {
    this.STORAGE_KEY = 'resenha_party_hub_state_v1';
    
    // Lista padrão de jogadores
    this.defaultPlayers = ['Marquito', 'Nic', 'Vivi'];
    
    // Jogadores e Placar
    this.players = [];
    this.scores = {}; // { 'Nome': { shots: 0, challenges: 0, chickens: 0 } }
    
    // Estado de navegação
    this.currentGame = null;
    
    // Registro de temporizadores e animações para evitar travamentos e memory leaks
    this.activeTimeouts = new Set();
    this.activeIntervals = new Set();
    this.activeRAFs = new Set();

    // Listeners de eventos reativos
    this.listeners = {
      playersChanged: [],
      scoreChanged: [],
      gameChanged: []
    };

    this.loadState();
  }

  // --- PERSISTÊNCIA ---
  loadState() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.players) && parsed.players.length > 0) {
          this.players = parsed.players;
          this.scores = parsed.scores || {};
          // Assegura que todos os jogadores tenham scores inicializados
          this.players.forEach(p => this.ensurePlayerScore(p));
          return;
        }
      }
    } catch (e) {
      console.warn('Falha ao ler localStorage:', e);
    }
    // Estado padrão inicial
    this.resetToDefaults();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        players: this.players,
        scores: this.scores
      }));
    } catch (e) {
      console.warn('Falha ao salvar no localStorage:', e);
    }
  }

  resetToDefaults() {
    this.players = [...this.defaultPlayers];
    this.scores = {};
    this.players.forEach(p => {
      this.scores[p] = { shots: 0, challenges: 0, chickens: 0 };
    });
    this.saveState();
    this.emit('playersChanged', this.players);
    this.emit('scoreChanged', this.scores);
  }

  resetScoresOnly() {
    this.players.forEach(p => {
      this.scores[p] = { shots: 0, challenges: 0, chickens: 0 };
    });
    this.saveState();
    this.emit('scoreChanged', this.scores);
  }

  ensurePlayerScore(playerName) {
    if (!this.scores[playerName]) {
      this.scores[playerName] = { shots: 0, challenges: 0, chickens: 0 };
    }
  }

  // --- GERENCIAMENTO DE JOGADORES ---
  addPlayer(rawName) {
    const name = (rawName || '').trim();
    if (!name) return false;
    // Evita duplicatas exatas
    if (this.players.some(p => p.toLowerCase() === name.toLowerCase())) {
      return false;
    }
    this.players.push(name);
    this.ensurePlayerScore(name);
    this.saveState();
    this.emit('playersChanged', this.players);
    this.emit('scoreChanged', this.scores);
    return true;
  }

  removePlayer(playerName) {
    if (this.players.length <= 2) {
      alert('É necessário manter no mínimo 2 jogadores na resenha!');
      return false;
    }
    this.players = this.players.filter(p => p !== playerName);
    delete this.scores[playerName];
    this.saveState();
    this.emit('playersChanged', this.players);
    this.emit('scoreChanged', this.scores);
    return true;
  }

  getPlayers() {
    return [...this.players];
  }

  // --- ATUALIZAÇÕES DO PLACAR ---
  addShot(playerName, count = 1) {
    this.ensurePlayerScore(playerName);
    this.scores[playerName].shots = Math.max(0, (this.scores[playerName].shots || 0) + count);
    this.saveState();
    this.emit('scoreChanged', this.scores);
  }

  addChallenge(playerName, count = 1) {
    this.ensurePlayerScore(playerName);
    this.scores[playerName].challenges = Math.max(0, (this.scores[playerName].challenges || 0) + count);
    this.saveState();
    this.emit('scoreChanged', this.scores);
  }

  addChicken(playerName, count = 1) {
    this.ensurePlayerScore(playerName);
    this.scores[playerName].chickens = Math.max(0, (this.scores[playerName].chickens || 0) + count);
    this.saveState();
    this.emit('scoreChanged', this.scores);
  }

  // --- REGISTRO ROBUSTO DE TEMPORIZADORES (PREVENÇÃO DE TRAVAMENTOS & LEAKS) ---
  setTimeoutSafe(fn, ms) {
    let id;
    const wrapped = () => {
      this.activeTimeouts.delete(id);
      fn();
    };
    id = window.setTimeout(wrapped, ms);
    this.activeTimeouts.add(id);
    return id;
  }

  clearTimeoutSafe(id) {
    if (id) {
      window.clearTimeout(id);
      this.activeTimeouts.delete(id);
    }
  }

  setIntervalSafe(fn, ms) {
    const id = window.setInterval(fn, ms);
    this.activeIntervals.add(id);
    return id;
  }

  clearIntervalSafe(id) {
    if (id) {
      window.clearInterval(id);
      this.activeIntervals.delete(id);
    }
  }

  requestAnimationFrameSafe(fn) {
    let id;
    const wrapped = (time) => {
      this.activeRAFs.delete(id);
      fn(time);
    };
    id = window.requestAnimationFrame(wrapped);
    this.activeRAFs.add(id);
    return id;
  }

  cancelAnimationFrameSafe(id) {
    if (id) {
      window.cancelAnimationFrame(id);
      this.activeRAFs.delete(id);
    }
  }

  // Limpa todos os temporizadores e animações do jogo ativo
  clearAllGameLoops() {
    this.activeTimeouts.forEach(id => window.clearTimeout(id));
    this.activeTimeouts.clear();

    this.activeIntervals.forEach(id => window.clearInterval(id));
    this.activeIntervals.clear();

    this.activeRAFs.forEach(id => window.cancelAnimationFrame(id));
    this.activeRAFs.clear();
  }

  // --- PUB / SUB ---
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Erro no listener de ${event}:`, e);
        }
      });
    }
  }
}

window.ResenhaState = new StateManager();
