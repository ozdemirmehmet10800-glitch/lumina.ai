/**
 * LUMINA SANCTUM - ULTIMATE COGNITIVE & DEEP WORK ENGINE
 * Features:
 * 1. The Cosmic Void (Rock-solid, auto-resizing 60fps gravitational Black Hole particle accelerator)
 * 2. Mind Purge (Düşünce Öğütücü - converts worries into stardust particles sucked into singularity)
 * 3. 4-Channel Ambient Sound Mixer (Rain, Forest, Ocean Waves, 432Hz Alpha Waves synthesized via Web Audio)
 * 4. Memento Mori Life Matrix (4,160 weeks interactive life matrix)
 */

class LuminaSanctumEngine {
  constructor() {
    this.voidCanvas = null;
    this.voidCtx = null;
    this.voidParticles = [];
    this.voidTextParticles = [];
    this.blackHoleAngle = 0;
    this.animId = null;
    this.isRunning = false;
    this.resizeObserver = null;

    // Ambient audio nodes
    this.audioCtx = null;
    this.ambientTracks = {};
  }

  // ==========================================
  // 1. THE COSMIC VOID (BLACK HOLE ENGINE)
  // ==========================================
  initVoid(canvasId = 'sanctum-void-canvas') {
    this.voidCanvas = document.getElementById(canvasId);
    if (!this.voidCanvas) return;
    this.voidCtx = this.voidCanvas.getContext('2d');

    // Setup ResizeObserver for responsive canvas rendering
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    const wrapper = this.voidCanvas.parentElement;
    if (wrapper) {
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(wrapper);
    }

    this.resizeCanvas();
    this.initAccretionParticles();

    if (!this.isRunning) {
      this.isRunning = true;
      this.renderVoidLoop();
    }

    this.updateVoidCounter();
  }

  resizeCanvas() {
    if (!this.voidCanvas) return;
    const wrapper = this.voidCanvas.parentElement;
    const w = wrapper ? wrapper.clientWidth : 800;
    const h = wrapper ? (wrapper.clientHeight || 420) : 420;

    if (w > 0 && h > 0) {
      this.voidCanvas.width = w;
      this.voidCanvas.height = h;
    }
  }

  initAccretionParticles() {
    this.voidParticles = [];
    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#38bdf8', '#fbbf24', '#ffffff'];
    for (let i = 0; i < 280; i++) {
      this.voidParticles.push({
        radius: Math.random() * 220 + 40,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.022 + 0.006,
        size: Math.random() * 2.2 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: 0.42 + Math.random() * 0.1
      });
    }
  }

  renderVoidLoop() {
    if (!this.isRunning) return;

    if (this.voidCtx && this.voidCanvas) {
      const ctx = this.voidCtx;
      const w = this.voidCanvas.width;
      const h = this.voidCanvas.height;

      if (w > 0 && h > 0) {
        const cx = w / 2;
        const cy = h / 2;

        // Semi-transparent fade for motion trails
        ctx.fillStyle = 'rgba(6, 9, 18, 0.28)';
        ctx.fillRect(0, 0, w, h);

        this.blackHoleAngle += 0.018;

        // 1. Swirling Accretion Disk Particles
        this.voidParticles.forEach(p => {
          p.angle += p.speed;
          const x = cx + Math.cos(p.angle) * p.radius;
          const y = cy + Math.sin(p.angle) * (p.radius * p.tilt);

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        });

        // 2. Event Horizon Corona (Outer Glow)
        const eventHorizonRadius = 45;
        const corona = ctx.createRadialGradient(cx, cy, eventHorizonRadius, cx, cy, 150);
        corona.addColorStop(0, 'rgba(168, 85, 247, 0.9)');
        corona.addColorStop(0.3, 'rgba(99, 102, 241, 0.45)');
        corona.addColorStop(0.7, 'rgba(6, 182, 212, 0.15)');
        corona.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(cx, cy, 150, 0, Math.PI * 2);
        ctx.fill();

        // 3. Absolute Singularity (Pure Darkness Event Horizon)
        ctx.fillStyle = '#02040a';
        ctx.beginPath();
        ctx.arc(cx, cy, eventHorizonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Ring border with spinning dash effect
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // 4. Infalling Text Particle Shredder
        if (this.voidTextParticles.length > 0) {
          for (let i = this.voidTextParticles.length - 1; i >= 0; i--) {
            const tp = this.voidTextParticles[i];
            const dx = cx - tp.x;
            const dy = cy - tp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Once inside singularity, evaporate
            if (dist < eventHorizonRadius) {
              this.voidTextParticles.splice(i, 1);
              continue;
            }

            const force = 420 / (dist + 12);
            tp.vx += (dx / dist) * force;
            tp.vy += (dy / dist) * force;

            // Gravitational vortex spin
            tp.vx += (-dy / dist) * 2.5;
            tp.vy += (dx / dist) * 2.5;

            tp.x += tp.vx * 0.35;
            tp.y += tp.vy * 0.35;
            tp.alpha = Math.min(tp.alpha, dist / 180);

            ctx.save();
            ctx.globalAlpha = Math.max(0, tp.alpha);
            ctx.font = '700 15px "Outfit", sans-serif';
            ctx.fillStyle = tp.color;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.fillText(tp.char, tp.x, tp.y);
            ctx.restore();
          }
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.renderVoidLoop());
  }

  // ==========================================
  // 2. MIND PURGE (DÜŞÜNCE ÖĞÜTÜCÜ)
  // ==========================================
  feedVoidWithText(text) {
    if (!text || !text.trim() || !this.voidCanvas) return;
    const w = this.voidCanvas.width || 800;
    const h = this.voidCanvas.height || 420;

    const chars = text.trim().split('');
    const total = chars.length;
    const colors = ['#ffffff', '#38bdf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];

    this.playVacuumSonicWave();

    chars.forEach((char, idx) => {
      const angle = (idx / total) * Math.PI * 2 + (Math.random() * 0.4);
      const spawnRadius = Math.min(w, h) * 0.42 + (Math.random() * 40);

      this.voidTextParticles.push({
        char: char,
        x: (w / 2) + Math.cos(angle) * spawnRadius,
        y: (h / 2) + Math.sin(angle) * (spawnRadius * 0.5),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        alpha: 1.0,
        color: colors[idx % colors.length]
      });
    });

    // Record stats
    const current = parseInt(localStorage.getItem('lumina_void_count') || '0', 10);
    localStorage.setItem('lumina_void_count', (current + 1).toString());
    this.updateVoidCounter();

    // Reward XP
    if (this.addXP) this.addXP(25);
  }

  updateVoidCounter() {
    const counterEl = document.getElementById('sanctum-void-counter');
    if (counterEl) {
      const count = localStorage.getItem('lumina_void_count') || '0';
      counterEl.textContent = `Yok Edilen Yük: ${count}`;
    }
  }

  playVacuumSonicWave() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Deep cosmic sub-bass whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 1.2);

      gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Ses motoru başlatılamadı:', e);
    }
  }

  // ==========================================
  // 3. AMBIENT SOUND MIXER (SYNTHESIZED WEB AUDIO)
  // ==========================================
  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setAmbientTrackVolume(trackName, volume) {
    this.initAudioContext();

    if (volume <= 0) {
      this.stopAmbientTrack(trackName);
      return;
    }

    if (!this.ambientTracks[trackName]) {
      this.startAmbientTrack(trackName, volume);
    } else {
      this.ambientTracks[trackName].gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    }
  }

  startAmbientTrack(trackName, volume = 0.5) {
    this.initAudioContext();
    const ctx = this.audioCtx;

    if (this.ambientTracks[trackName]) {
      this.stopAmbientTrack(trackName);
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);

    if (trackName === 'binaural') {
      // 432 Hz / 10 Hz Alpha Beats
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(432, ctx.currentTime);
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(442, ctx.currentTime); // 10 Hz Alpha difference

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(gainNode);

      oscL.start();
      oscR.start();

      this.ambientTracks[trackName] = {
        gain: gainNode,
        nodes: [oscL, oscR, merger]
      };
    } else {
      // Noise-based generators (Rain, Forest, Waves)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink / Brown noise filter
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (trackName === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, ctx.currentTime);
      } else if (trackName === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);
      } else {
        // Forest
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
      }

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      this.ambientTracks[trackName] = {
        gain: gainNode,
        nodes: [whiteNoise, filter]
      };
    }
  }

  stopAmbientTrack(trackName) {
    if (this.ambientTracks[trackName]) {
      const track = this.ambientTracks[trackName];
      track.nodes.forEach(n => {
        try {
          if (n.stop) n.stop();
          n.disconnect();
        } catch (e) {}
      });
      try {
        track.gain.disconnect();
      } catch (e) {}
      delete this.ambientTracks[trackName];
    }
  }

  stopAllAmbient() {
    Object.keys(this.ambientTracks).forEach(t => this.stopAmbientTrack(t));
  }

  // ==========================================
  // 5. COGNITIVE SIMULATORS & MEMENTO MORI
  // ==========================================
  calculateMementoMori(age = 25, totalYears = 80) {
    const validAge = Math.max(1, Math.min(99, parseInt(age, 10) || 25));
    const totalWeeks = totalYears * 52; // 4,160
    const livedWeeks = Math.min(totalWeeks, Math.round(validAge * 52));
    const remainingWeeks = Math.max(0, totalWeeks - livedWeeks);
    const livedPct = Math.round((livedWeeks / totalWeeks) * 100);

    return {
      age: validAge,
      totalWeeks,
      livedWeeks,
      remainingWeeks,
      livedPct,
      remainingPct: 100 - livedPct
    };
  }

  generateAlterEgoResponse(excuse) {
    const raw = (excuse || '').trim();
    if (!raw) return 'Sessizlik de bir bahanedir. Karşıma bir gerçekle gel.';

    const lower = raw.toLowerCase();
    if (lower.includes('yorgun') || lower.includes('enerjim yok')) {
      return `🪞 "Yorgun değilsin; beynin konforsuzluktan kaçıyor. Gerçek dinlenme ertelemek değil, işi bitirip zihinsel kapanışa ulaşmaktır. Kalk ve sadece 5 dakika odaklan."`;
    }
    if (lower.includes('yarın') || lower.includes('sonra')) {
      return `🪞 "'Yarın' tembel zihinlerin en sevdiği peri masalıdır. Şu an sahip olduğun tek gerçek andır. Yarın da tıpkı bugünkü gibi hissedeceksin. Hemen şimdi başla."`;
    }
    if (lower.includes('korku') || lower.includes('hata') || lower.includes('mükemmel')) {
      return `🪞 "Mükemmeliyetçilik, korkunun cilalanmış halidir. Hata yapmaktan değil, hiçbir şey denemeden yerinde saymaktan kork. İlk taslak berbat olabilir ama var olmak zorundadır."`;
    }
    return `🪞 "Bu gerekçen ('${raw}') seni kısa vadede rahatlatıyor ama uzun vadede potansiyelini öldürüyor. İradeni bahanelerin değil, hedeflerin yönetsin. İlk adımı şimdi at."`;
  }

  simulateMultiverse(choiceA, choiceB) {
    const a = choiceA || 'Konfor alanında kalmak';
    const b = choiceB || 'Cesur hamleyi yapmak';

    return {
      universeA: {
        title: `Evren A: "${a}"`,
        year1: '📅 1. Yıl: Değişim yok. Kısa vadeli rahatlık, derinlerde büyüyen içsel bir huzursuzluk ve erteleme döngüsü.',
        year5: '📅 5. Yıl: Kaçırılan fırsatlar. Aynı rutin, körelen yetenekler ve "keşke deneseydim" pişmanlığı.',
        year10: '📅 10. Yıl: Geri döndürülemez zaman kaybı. Potansiyelinin çok altında sıradan bir yaşam kabullenişi.'
      },
      universeB: {
        title: `Evren B: "${b}"`,
        year1: '📅 1. Yıl: İlk 90 gün zorlu adaptasyon ve sancı; ardından gelen ilk somut zaferler ve tavan yapan özgüven.',
        year5: '📅 5. Yıl: Çarpan etkisi. Yeni uzmanlık, genişleyen etki alanı ve kendi kaderini kontrol etme özgürlüğü.',
        year10: '📅 10. Yıl: Transendans. 10 yıl önce alınan o cesur karara şükranla bakan, zirvede bir benlik.'
      }
    };
  }

  // ==========================================
  // 6. RPG REWARD SYSTEM
  // ==========================================
  addXP(amount) {
    const stats = JSON.parse(localStorage.getItem('lumina_rpg_stats') || '{"lvl":1,"xp":45,"title":"Uyanış Yolcusu"}');
    stats.xp += amount;
    const requiredXP = stats.lvl * 100;

    if (stats.xp >= requiredXP) {
      stats.lvl += 1;
      stats.xp = stats.xp - requiredXP;
      const titles = ['Uyanış Yolcusu', 'Odak Çırağı', 'Zihin Mimarı', 'Stoacı Bilge', 'Zaman Efendisi', 'Nöro-Transendans'];
      stats.title = titles[Math.min(stats.lvl - 1, titles.length - 1)];
      if (window.showToast) window.showToast(`🎉 TEBRİKLER! Seviye Atladın: LVL ${stats.lvl} - ${stats.title}!`, 'success');
    }

    localStorage.setItem('lumina_rpg_stats', JSON.stringify(stats));
    if (window.updateTopbarRPG) window.updateTopbarRPG();
  }
}

// Global Sanctum Instance
window.LuminaSanctum = new LuminaSanctumEngine();

