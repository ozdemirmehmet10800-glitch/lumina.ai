/**
 * LUMINA SANCTUM - ULTIMATE COGNITIVE & PHILOSOPHICAL ENGINE
 * 12 Deep Interactive Chambers:
 * 1. The Void (Gravitational black hole text shredder & audio vacuum)
 * 2. The Alter-Ego (Brutally honest psychological mirror)
 * 3. The Multiverse (1-5-10 year timeline branching simulator)
 * 4. The Council (Aurelius, Nietzsche, Seneca, Socrates, Schopenhauer, Lao Tzu)
 * 5. Memento Mori (Life in 4,160 weeks interactive matrix)
 * 6. Vagus Zen Breathing (Box breathing 4-4-4-4 & 5-5 Coherence with 432Hz tone)
 * 7. Jungian Shadow Archetype Mirror (Inner projection & antidote)
 * 8. CBT Cognitive Antidote (Bilişsel Çarpıtma & Felaket Savar)
 * 9. Dream Laboratory (Bilinçaltı Sembol Çözücü & Rüya Günlüğü)
 * 10. Dopamine Reset & Urge Surfer (Nörokimyasal Oruç & 90-sn Dürtü Dalgası)
 * 11. Moral Dilemmas & Philosophical DNA (Etik Çıkmazlar Arenası)
 * 12. Neuro-Wave Binaural Generator (Gamma, Beta, Alpha, Theta, Delta)
 */

class LuminaSanctumEngine {
  constructor() {
    this.voidCanvas = null;
    this.voidCtx = null;
    this.voidParticles = [];
    this.voidTextParticles = [];
    this.blackHoleAngle = 0;
    this.breathInterval = null;
    this.isBreathingActive = false;

    // Audio nodes
    this.brownNoiseNode = null;
    this.brownNoiseGain = null;
    this.binauralNodes = null;

    // Urge surf timer
    this.urgeSurfInterval = null;
  }

  // ==========================================
  // 1. THE VOID (GRAVITATIONAL BLACK HOLE)
  // ==========================================
  initVoid(canvasId) {
    this.voidCanvas = document.getElementById(canvasId);
    if (!this.voidCanvas) return;
    this.voidCtx = this.voidCanvas.getContext('2d');
    
    const rect = this.voidCanvas.getBoundingClientRect();
    this.voidCanvas.width = rect.width || 800;
    this.voidCanvas.height = rect.height || 420;

    this.voidParticles = [];
    for (let i = 0; i < 260; i++) {
      this.voidParticles.push({
        radius: Math.random() * 220 + 35,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.025 + 0.008),
        size: Math.random() * 2.5 + 0.8,
        color: ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#ffffff'][Math.floor(Math.random() * 5)]
      });
    }

    this.renderVoidLoop();
  }

  renderVoidLoop() {
    if (!this.voidCtx || !this.voidCanvas) return;
    const ctx = this.voidCtx;
    const w = this.voidCanvas.width;
    const h = this.voidCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Cosmic trail fade
    ctx.fillStyle = 'rgba(6, 9, 18, 0.28)';
    ctx.fillRect(0, 0, w, h);

    this.blackHoleAngle += 0.02;

    // Draw Accretion Disk Particles
    this.voidParticles.forEach(p => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * (p.radius * 0.44); // 3D tilt

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    });

    // Event Horizon Glow
    const eventHorizonRadius = 42;
    const glowGrad = ctx.createRadialGradient(cx, cy, eventHorizonRadius, cx, cy, 140);
    glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.85)');
    glowGrad.addColorStop(0.35, 'rgba(99, 102, 241, 0.35)');
    glowGrad.addColorStop(1, 'transparent');

    ctx.save();
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.fill();

    // Absolute Darkness Singularity
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, eventHorizonRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Draw & Pull Disintegrating Text Particles
    if (this.voidTextParticles.length > 0) {
      for (let i = this.voidTextParticles.length - 1; i >= 0; i--) {
        const tp = this.voidTextParticles[i];

        const dx = cx - tp.x;
        const dy = cy - tp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < eventHorizonRadius) {
          this.voidTextParticles.splice(i, 1);
          continue;
        }

        const force = 340 / (dist + 8);
        tp.vx += (dx / dist) * force;
        tp.vy += (dy / dist) * force;

        // Spiral orbital motion
        tp.vx += (-dy / dist) * 2.2;
        tp.vy += (dx / dist) * 2.2;

        tp.x += tp.vx * 0.35;
        tp.y += tp.vy * 0.35;
        tp.alpha = Math.min(tp.alpha, dist / 180);

        ctx.save();
        ctx.globalAlpha = Math.max(0, tp.alpha);
        ctx.font = '600 15px "Outfit", sans-serif';
        ctx.fillStyle = tp.color;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.fillText(tp.char, tp.x, tp.y);
        ctx.restore();
      }
    }

    requestAnimationFrame(() => this.renderVoidLoop());
  }

  feedVoidWithText(text) {
    if (!text.trim() || !this.voidCanvas) return;
    const w = this.voidCanvas.width;
    const h = this.voidCanvas.height;

    const chars = text.split('');
    const total = chars.length;

    this.playVacuumSound();

    chars.forEach((char, idx) => {
      const angle = (idx / total) * Math.PI * 2;
      const spawnRadius = 200 + Math.random() * 60;
      this.voidTextParticles.push({
        char: char,
        x: w / 2 + Math.cos(angle) * spawnRadius,
        y: h / 2 + Math.sin(angle) * spawnRadius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        alpha: 1.0,
        color: ['#ffffff', '#22d3ee', '#818cf8', '#f472b6', '#a78bfa'][idx % 5]
      });
    });

    // Record Void Stats in localStorage
    const voidHistory = JSON.parse(localStorage.getItem('lumina_void_count') || '0');
    localStorage.setItem('lumina_void_count', JSON.stringify(voidHistory + 1));
  }

  playVacuumSound() {
    try {
      if (window.LuminaAudio) {
        window.LuminaAudio.initContext();
        const ctx = window.LuminaAudio.ctx;
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 2.5);

        gain.gain.setValueAtTime(0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      }
    } catch (e) {
      console.warn('Vacuum sound error:', e);
    }
  }

  // ==========================================
  // 2. THE ALTER-EGO (BRUTAL HONEST PSYCHOLOGICAL MIRROR)
  // ==========================================
  generateAlterEgoResponse(userExcuse) {
    const clean = userExcuse.toLowerCase();

    if (clean.includes('yoruldum') || clean.includes('enerjim yok') || clean.includes('tükenmiş')) {
      return `🪞 **İkinci Benliğin:**
"Bedenin gerçekten yoruldu mu, yoksa hedefine ulaşamama ihtimalinin ağırlığı mı seni eziyor? 
Yorulmadın. Sadece yapman gereken şey cesaret istiyor ve sen konfor alanına sığınmak için beynine 'yorgunum' sinyali ürettiriyorsun. 
2 saat telefonda video kaydıracak enerjin varsa, bu işe 15 dakika ayıracak iraden de var. Yüzleş ve kalk."`;
    }

    if (clean.includes('yarın') || clean.includes('sonra') || clean.includes('ertel')) {
      return `🪞 **İkinci Benliğin:**
"Yarın diye bir yer yok. Geçen hafta da 'yarın' demiştin, o gün bugündü. 
Zaman akıp gidiyor ve sen gelecekteki haline borç takmaktan başka bir şey yapmıyorsun. Yarınki halin bugünkünden daha sihirli bir motivasyona sahip olmayacak. 
Ya şimdi ilk adımı atarsın ya da bir yıl sonra 'keşke o gün başlasaydım' pişmanlığıyla yaşarsın. Karar ver."`;
    }

    if (clean.includes('mükemmel') || clean.includes('hazır değilim') || clean.includes('kork')) {
      return `🪞 **İkinci Benliğin:**
"Mükemmeliyetçilik bir erdem değil; kibirli bir korkaklıktır. 
'Henüz hazır değilim' diyorsun çünkü hata yapıp ego zedelenmesi yaşamaktan ödün kopuyor. 
Dünyayı değiştiren hiçbir şey mükemmel başlamadı. Berbat bir taslak, hiç yazılmamış bir şaheserden bin kat daha değerlidir. Bırak çirkin olsun, yeter ki gerçek olsun."`;
    }

    if (clean.includes('anlamı yok') || clean.includes('başarısız') || clean.includes('değmez')) {
      return `🪞 **İkinci Benliğin:**
"Bu nihilist sığınak çok ucuz. 'Hiçbir şeyin anlamı yok' demek, sorumluluk almaktan kaçmanın en kolay kılıfıdır. 
Hayatın doğuştan bir anlamı yoksa, ona anlam yüklemek senin tek görevin. Başarısızlık bir son değil; sadece bir bilgi parçasıdır. Korkunu felsefe diye yutturma, sahaya in."`;
    }

    return `🪞 **İkinci Benliğin:**
"Bu yazdığın cümleye dışarıdan üçüncü bir gözle bak: Bu gerçek bir engel mi, yoksa zihninin seni korumak için uydurduğu akıllıca bir bahane mi? 
Sen kendi potansiyelinin farkında olduğun için bu kadar korkuyorsun. Bahaneleri masadan kaldır. Şu an tek yapman gereken şey düşünmeyi bırakıp eyleme geçmek."`;
  }

  // ==========================================
  // 3. THE MULTIVERSE (PARALLEL TIMELINES)
  // ==========================================
  simulateMultiverse(choiceA, choiceB) {
    const safeA = choiceA || 'Seçenek A (Mevcut Durum / Konfor)';
    const safeB = choiceB || 'Seçenek B (Cesur Adım / Bilinmezlik)';

    return {
      universeA: {
        title: `🌌 Evren I: "${safeA}"`,
        year1: `🌱 1. YIL: Kısa vadeli bir rahatlık var ama içten içe bir eksiklik hissi kemiriyor. 'Acaba diğer yolu seçseydim ne olurdu?' sorusu ara sıra zihnini yokluyor.`,
        year5: `⚠️ 5. YIL: Konfor alanı bir hapishaneye dönüştü. Aynı döngüler, tanıdık sorunlar. Çevrendeki insanların cesur kararlarla nereye vardığını izlerken içinde sessiz bir pişmanlık birikiyor.`,
        year10: `⏳ 10. YIL: Artık geriye dönüş çok zor. Güvenli oynadın ama potansiyelinin sadece %20'sini yaşadın. En büyük bedel başarısızlık değil; 'denememiş olmanın' ağırlığı.`
      },
      universeB: {
        title: `⚡ Evren II: "${safeB}"`,
        year1: `🔥 1. YIL: Zorlanıyorsun. Belirsizlik yüksek, hata yapıyorsun ve bazen korkuyorsun. Ama hayatta olduğunu, bir şeyler inşa ettiğini iliklerine kadar hissediyorsun.`,
        year5: `🏆 5. YIL: Çektiğin zorluklar bilgeliğe ve özgüvene dönüştü. Artık eski korkuların sana komik geliyor. Yeni kapılar açıldı, yeni bir ligdesin.`,
        year10: `👑 10. YIL: Geriye baktığında iyi ki o gün o cesareti göstermişim diyorsun. Yanılsan bile 'elimden gelenin en iyisini yaptım' huzuruyla dolusun. Kendi hikayenin kahramanısın.`
      }
    };
  }

  // ==========================================
  // 4. THE PHILOSOPHICAL COUNCIL (6 PHILOSOPHERS)
  // ==========================================
  consultCouncil(question) {
    return [
      {
        name: 'Marcus Aurelius',
        school: 'Stoacılık İmparatoru',
        badge: '🏛️ STOACI',
        quote: `"Dış olaylar zihnini işgal edemez. Sana acı veren şey olayın kendisi değil; senin ona yüklediğin anlamdır. Bu anlamı hemen şu an yok etme gücüne sahipsin."`,
        verdict: `Bu konuyu kontrol edebileceğin tek şeye indirge: Senin şu anki ahlakın, iraden ve eylemin. Gerisini kadere teslim et.`
      },
      {
        name: 'Friedrich Nietzsche',
        school: 'Varoluşçuluk & Güç İstenci',
        badge: '⚡ VAROLUŞÇU',
        quote: `"Yaşamak için bir 'neden'i olan insan, hemen her 'nasıl'a katlanabilir. Seni öldürmeyen şey seni güçlendirir."`,
        verdict: `Zorluklardan kaçma, onları karakterini bileyecek bir çekiç olarak kucakla. 'Amor Fati' — Kaderini sadece kabullenme, onu tutkuyla sev.`
      },
      {
        name: 'Seneca',
        school: 'Roma Stoacılığı',
        badge: '⏳ ZAMAN BİLGESİ',
        quote: `"Hayat kısa değil; biz onun büyük kısmını boş yere harcıyoruz. Gelecek için kaygılanırken bugünü feda edenler hiçbir zaman yaşamaz."`,
        verdict: `Kaygı, gelecekteki acıyı bugüne peşin ödemektir. Şu an elinde olan tek ana odaklan ve zamanını değerli kıl.`
      },
      {
        name: 'Sokrates',
        school: 'Sorgulama Ustası',
        badge: '🪞 AYDINLATICI',
        quote: `"Sorgulanmamış bir hayat yaşamaya değmez. Bildiğim tek şey, hiçbir şey bilmediğimdir."`,
        verdict: `Kendi inançlarını sorgula: Gerçekten bunu istiyor musun, yoksa toplumun ve çevrenin sana yüklediği bir illüzyonu mu kovalıyorsun?`
      },
      {
        name: 'Arthur Schopenhauer',
        school: 'İrade & Gerçekçilik',
        badge: '🌑 REALİST',
        quote: `"İstekler denizinde boğulan insan asla tatmin olamaz. Mutluluk acının yokluğudur."`,
        verdict: `Beklentilerini sıfırla. Dış onay arayışından vazgeçtiğin gün gerçek huzura kavuşursun.`
      },
      {
        name: 'Lao Tzu',
        school: 'Taoizm & Akış Felsefesi',
        badge: '🌊 SU FELSEFESİ',
        quote: `"Su gibi ol. Su direnç göstermez, ama karşısına çıkan en sert kayayı bile zamanla deler geçer. 'Wu Wei' — Çabasız çaba."`,
        verdict: `Hayatı zorlamayı bırak. Olaylarla savaşmak yerine su gibi onların etrafından akıp hedefine odaklan.`
      }
    ];
  }

  // ==========================================
  // 5. MEMENTO MORI (LIFE IN 4,160 WEEKS)
  // ==========================================
  calculateMementoMori(age) {
    const userAge = parseInt(age) || 22;
    const avgLifespan = 80;
    const totalWeeks = avgLifespan * 52;
    const livedWeeks = userAge * 52;
    const remainingWeeks = Math.max(0, totalWeeks - livedWeeks);
    const livedPct = Math.round((livedWeeks / totalWeeks) * 100);

    return {
      totalWeeks,
      livedWeeks,
      remainingWeeks,
      livedPct,
      message: `Dünya üzerinde ortalama ${remainingWeeks} haftan kaldı. Bu haftalardan biri şu an akıp gidiyor. Küçük şeylere can sıkmak veya ertelemek için gerçekten vaktin var mı?`
    };
  }

  // ==========================================
  // 6. VAGUS ZEN BREATHING ENGINE (432Hz)
  // ==========================================
  startBreathing(circleElem, textElem, mode = 'box') {
    this.isBreathingActive = true;
    let phase = 0;

    let phases = [];
    let intervalDuration = 4000;

    if (mode === 'coherence') {
      intervalDuration = 5000;
      phases = [
        { text: 'Derin Nefes Al (5 sn)...', scale: 1.5, freq: 432 },
        { text: 'Yavaşça Boşalt (5 sn)...', scale: 1.0, freq: 288 }
      ];
    } else {
      intervalDuration = 4000;
      phases = [
        { text: 'Nefes Al (4 sn)...', scale: 1.45, freq: 432 },
        { text: 'Nefesi Tut (4 sn)...', scale: 1.45, freq: 432 },
        { text: 'Yavaşça Ver (4 sn)...', scale: 1.0, freq: 320 },
        { text: 'Boşlukta Kal (4 sn)...', scale: 1.0, freq: 216 }
      ];
    }

    const cycle = () => {
      if (!this.isBreathingActive) return;
      const current = phases[phase];
      if (textElem) textElem.textContent = current.text;
      if (circleElem) {
        circleElem.style.transform = `scale(${current.scale})`;
        circleElem.style.transition = `transform ${intervalDuration / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`;
      }

      this.playZenTone(current.freq, intervalDuration / 1000);
      phase = (phase + 1) % phases.length;
    };

    cycle();
    this.breathInterval = setInterval(cycle, intervalDuration);
  }

  stopBreathing() {
    this.isBreathingActive = false;
    if (this.breathInterval) {
      clearInterval(this.breathInterval);
      this.breathInterval = null;
    }
  }

  playZenTone(freq, dur = 3.9) {
    try {
      if (window.LuminaAudio) {
        window.LuminaAudio.initContext();
        const ctx = window.LuminaAudio.ctx;
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur - 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + dur);
      }
    } catch (e) {
      console.warn('Zen tone error:', e);
    }
  }

  // ==========================================
  // 7. JUNGIAN SHADOW & ARCHETYPE ANALYZER
  // ==========================================
  analyzeArchetype(moodText) {
    const text = moodText.toLowerCase();

    if (text.includes('öfke') || text.includes('kızgın') || text.includes('savaş') || text.includes('hırs')) {
      return {
        name: 'GÖLGE SAVAŞÇI (Shadow Warrior)',
        icon: '⚔️',
        energy: '%88 Yıkıcı / İtici Güç',
        diagnosis: 'İçindeki adalet veya kontrol ihtiyacı hırs ve öfkeye dönüşmüş durumda. Bu enerjiyi başkalarıyla tartışmak yerine büyük bir hedefi yıkıp geçmek için yakıt olarak kullan.',
        antidote: 'Öfkeni tepkisel değil, stratejik eyleme dönüştür.'
      };
    }

    if (text.includes('kork') || text.includes('kaygı') || text.includes('panik') || text.includes('endişe')) {
      return {
        name: 'KORUYUCU GÖLGE (The Anxious Protector)',
        icon: '🛡️',
        energy: '%75 Savunma / Kaçınma',
        diagnosis: 'Bilinçaltın seni olası bir tehlikeden veya başarısızlıktan korumak için alarm zillerini çalıyor. Bu bir zayıflık değil, aşırı korumacı bir iç ses.',
        antidote: 'Korkuya teşekkür et ama direksiyona bilincini geçir.'
      };
    }

    if (text.includes('boşluk') || text.includes('yalnız') || text.includes('anlamsız')) {
      return {
        name: 'VAROLUŞÇU SÜRGÜN (The Cosmic Exile)',
        icon: '🌌',
        energy: '%60 Arayış / Derinlik',
        diagnosis: 'Yüzeysel meşguliyetlerden bıkmış bir ruh hali. Zihnin tüketmekten yoruldu ve üretmek, anlam inşa etmek istiyor.',
        antidote: 'Anlam dışarıda aranmaz; bugün inşa edeceğin küçük bir işte bulunur.'
      };
    }

    return {
      name: 'BİLGE GÖZLEMCİ (The Sovereign Sage)',
      icon: '🦉',
      energy: '%90 Zihinsel Berraklık',
      diagnosis: 'Şu an duygularını uzaktan bir nehir gibi izleyebilen, merkezinde kalmayı başarmış güçlü bir bilinç seviyesindesin.',
      antidote: 'Bu sakinliği en zorlu projene odaklanarak taçlandır.'
    };
  }

  // ==========================================
  // 8. CBT COGNITIVE ANTIDOTE (FELAKET SAVAR)
  // ==========================================
  reframeCognitiveDistortion(toxicThought) {
    const text = toxicThought.trim();

    return {
      originalThought: text,
      distortionIdentified: 'Bilişsel Çarpıtma: Felaketleştirme & Zihin Okuma',
      rationalReframing: `Gerçeklik Analizi:\n1. Zihnin 'en kötü senaryoyu' gerçekmiş gibi kurguluyor.\n2. Oysa geçmişte 'kesin batıracağım' dediğin yüzlerce durumdan başarıyla veya ders çıkararak çıktın.\n3. Duygular birer gerçeklik (fact) değil, sadece geçici biyokimyasal sinyallerdir.`,
      affirmation: `⚡ Yeni Güçlü Çerçeve: "Her şeyi kontrol edemem ama şu an önümdeki ilk somut adımı sakince yönetebilirim."`
    };
  }

  // ==========================================
  // 9. DREAM LABORATORY & SUBCONSCIOUS DECODER
  // ==========================================
  analyzeDream(dreamText) {
    const lower = dreamText.toLowerCase();
    const symbolsFound = [];

    if (lower.includes('düş') || lower.includes('uçurum') || lower.includes('boşluk')) {
      symbolsFound.push({
        symbol: 'Düşmek & Uçurum',
        archetype: 'Kontrolü Bırakma / Ego Sarsılması',
        interpretation: 'Hayatında kontrol edemediğin bir durum seni korkutuyor. Bilinçaltın sana şunu fısıldıyor: Düşmekten korkma, zemin sandığından daha yakın.'
      });
    }

    if (lower.includes('uç') || lower.includes('gökyüzü') || lower.includes('kanat')) {
      symbolsFound.push({
        symbol: 'Uçmak & Süzülmek',
        archetype: 'Aşkınlık / Sınırları Aşma',
        interpretation: 'Mevcut prangalarından kurtulma isteğin zirvede. Yaratıcı potansiyelin baskılanamayacak kadar güçlendi.'
      });
    }

    if (lower.includes('su') || lower.includes('deniz') || lower.includes('okyanus') || lower.includes('boğul')) {
      symbolsFound.push({
        symbol: 'Su & Okyanus Derinliği',
        archetype: 'Duygusal Bilinçaltı',
        interpretation: 'Bastırılmış yoğun hisler ve sezgiler yüzeye çıkmaya çalışıyor. Mantığını bir an kenara bırakıp iç sesini dinlemelisin.'
      });
    }

    if (lower.includes('kaç') || lower.includes('kovala') || lower.includes('canavar') || lower.includes('gölge')) {
      symbolsFound.push({
        symbol: 'Kovalanmak & Karanlık Figür',
        archetype: 'Gölge Benlik (Jungian Shadow)',
        interpretation: 'Kaçtığın şey bir dış tehdit değil, kendinde kabul etmek istemediğin bir duygu, öfke ya da gerçekleşmemiş bir arzu.'
      });
    }

    if (lower.includes('ev') || lower.includes('oda') || lower.includes('kapı') || lower.includes('kilit')) {
      symbolsFound.push({
        symbol: 'Gizli Odalar & Kapılar',
        archetype: 'Ruhsal Mimari / Keşfedilmemiş Alanlar',
        interpretation: 'Kişiliğinde henüz adım atmadığın yeni yetenekler ve keşfedilmeyi bekleyen potansiyeller var.'
      });
    }

    if (symbolsFound.length === 0) {
      symbolsFound.push({
        symbol: 'Bilinç Akışı & Sembolik Sis',
        archetype: 'Zihinsel Sindirim',
        interpretation: 'Rüyan gün içinde yaşanan deneyimlerin ve çözülmemiş duygu artıklarının bilinçaltı tarafından düzenlenmesini temsil ediyor.'
      });
    }

    const lucidityScore = Math.min(95, Math.floor(Math.random() * 30 + 65));

    const dreamEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
      text: dreamText,
      symbols: symbolsFound,
      lucidity: lucidityScore,
      coreMessage: symbolsFound[0].interpretation
    };

    this.saveDream(dreamEntry);
    return dreamEntry;
  }

  getSavedDreams() {
    return JSON.parse(localStorage.getItem('lumina_saved_dreams') || '[]');
  }

  saveDream(dream) {
    const list = this.getSavedDreams();
    list.unshift(dream);
    localStorage.setItem('lumina_saved_dreams', JSON.stringify(list.slice(0, 15)));
  }

  deleteDream(id) {
    let list = this.getSavedDreams();
    list = list.filter(d => d.id !== id);
    localStorage.setItem('lumina_saved_dreams', JSON.stringify(list));
  }

  // ==========================================
  // 10. NEUROCHEMICAL DOPAMINE FAST & URGE SURFER
  // ==========================================
  startDopamineFast(durationHours) {
    const now = Date.now();
    const target = now + durationHours * 3600 * 1000;
    const fastState = {
      active: true,
      startTime: now,
      targetTime: target,
      durationHours: durationHours
    };
    localStorage.setItem('lumina_dopamine_fast', JSON.stringify(fastState));
    return fastState;
  }

  getFastState() {
    const state = JSON.parse(localStorage.getItem('lumina_dopamine_fast') || 'null');
    if (!state || !state.active) return null;

    const remaining = Math.max(0, state.targetTime - Date.now());
    const total = state.targetTime - state.startTime;
    const progress = Math.min(100, Math.round(((total - remaining) / total) * 100));

    if (remaining === 0) {
      state.active = false;
      localStorage.setItem('lumina_dopamine_fast', JSON.stringify(state));
    }

    return {
      ...state,
      remainingMs: remaining,
      progressPct: progress,
      hoursLeft: Math.floor(remaining / (3600 * 1000)),
      minutesLeft: Math.floor((remaining % (3600 * 1000)) / (60 * 1000)),
      secondsLeft: Math.floor((remaining % (60 * 1000)) / 1000)
    };
  }

  endDopamineFast() {
    localStorage.removeItem('lumina_dopamine_fast');
  }

  startUrgeSurfing(onTick, onComplete) {
    let secondsLeft = 90;
    if (this.urgeSurfInterval) clearInterval(this.urgeSurfInterval);

    this.urgeSurfInterval = setInterval(() => {
      secondsLeft--;
      if (onTick) onTick(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(this.urgeSurfInterval);
        this.urgeSurfInterval = null;
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  stopUrgeSurfing() {
    if (this.urgeSurfInterval) {
      clearInterval(this.urgeSurfInterval);
      this.urgeSurfInterval = null;
    }
  }

  toggleBrownNoise(shouldPlay) {
    try {
      if (window.LuminaAudio) {
        window.LuminaAudio.initContext();
        const ctx = window.LuminaAudio.ctx;
        if (!ctx) return;

        if (!shouldPlay) {
          if (this.brownNoiseGain) {
            this.brownNoiseGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => {
              if (this.brownNoiseNode) this.brownNoiseNode.stop();
              this.brownNoiseNode = null;
            }, 600);
          }
          return;
        }

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        this.brownNoiseNode = ctx.createBufferSource();
        this.brownNoiseNode.buffer = noiseBuffer;
        this.brownNoiseNode.loop = true;

        this.brownNoiseGain = ctx.createGain();
        this.brownNoiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.brownNoiseGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.2);

        this.brownNoiseNode.connect(this.brownNoiseGain);
        this.brownNoiseGain.connect(ctx.destination);
        this.brownNoiseNode.start(0);
      }
    } catch (e) {
      console.warn('Brown noise error:', e);
    }
  }

  // ==========================================
  // 11. MORAL DILEMMAS & PHILOSOPHICAL DNA
  // ==========================================
  getDilemmas() {
    return [
      {
        id: 'trolley',
        title: 'Tramvay İkilemi (The Trolley Problem)',
        scenario: 'Frenleri patlamış bir tramvay 5 işçiye doğru hızla ilerliyor. Yanında bir makas kolu var; kolu çekersen tramvay yan yola sapacak ve orada bulunan 1 masum işçiyi ezecek. Ne yaparsın?',
        optionA: {
          text: 'Kolu çekerim, 1 kişiyi feda edip 5 kişinin hayatını kurtarırım.',
          trait: 'utilitarian',
          label: 'Faydacılık (En Yüksek Sayıda Yaşam)'
        },
        optionB: {
          text: 'Kola dokunmam. Olayın akışına müdahale edip aktif olarak bir insanı öldürmem.',
          trait: 'deontologist',
          label: 'Kantçı Deontoloji (Ahlaki İlke)'
        }
      },
      {
        id: 'theseus',
        title: 'Theseus\'un Gemisi (Kimlik Paradoksu)',
        scenario: 'Bir geminin çürüyen tüm tahtaları yıllar içinde teker teker yenisiyle değiştirilir. Son tahta da değiştiğinde, bu gemi hala aynı gemi midir yoksa tamamen yeni bir varlık mıdır?',
        optionA: {
          text: 'Hala aynı gemidir; kimlik parçalarda değil, onun hikayesinde ve biçimindedir.',
          trait: 'stoic',
          label: 'Bütünlük & Öz Felsefesi'
        },
        optionB: {
          text: 'Tamamen yeni bir gemidir; madde değiştiğinde eski varlık yok olmuştur.',
          trait: 'existentialist',
          label: 'Dinamik Varoluşçuluk'
        }
      },
      {
        id: 'gyges',
        title: 'Giges\'in Yüzüğü (Görünmezlik & Ahlak)',
        scenario: 'Sana taktığında seni tamamen görünmez kılan ve kimsenin asla yakalayamayacağı bir yüzük verilseydi; toplum kurallarına ve ahlaka yine de aynı sadakatle uyar mıydın?',
        optionA: {
          text: 'Evet, uyardım. Ahlak başkalarının görmesi için değil, kendi iç onurum ve karakterim içindir.',
          trait: 'stoic',
          label: 'Stoacı Erdem (Virtue Ethics)'
        },
        optionB: {
          text: 'Bazen kendi kurallarımı koyar ve adaleti kendi bildiğim gibi sağlardım.',
          trait: 'existentialist',
          label: 'Nietzscheci Güç İstenci'
        }
      },
      {
        id: 'experience_machine',
        title: 'Nozick\'in Deneyim Makinesi',
        scenario: 'Sana zihnine sınırsız mutluluk, başarı ve zevk simülasyonu yaşatacak bir deneyim makinesine ömrünün sonuna kadar bağlanma teklif ediliyor. Bağlanır mıydın?',
        optionA: {
          text: 'Bağlanmam. Gerçek acı, sahte mutluluktan her zaman daha değerlidir.',
          trait: 'existentialist',
          label: 'Varoluşsal Otantiklik'
        },
        optionB: {
          text: 'Bağlanırım. Beyin için algılanan gerçeklik nihai gerçekliktir.',
          trait: 'utilitarian',
          label: 'Hedonist Faydacılık'
        }
      }
    ];
  }

  recordDilemmaChoice(dilemmaId, choice) {
    const userChoices = JSON.parse(localStorage.getItem('lumina_dilemma_choices') || '{}');
    userChoices[dilemmaId] = choice;
    localStorage.setItem('lumina_dilemma_choices', JSON.stringify(userChoices));
    return this.calculatePhilosophicalDNA(userChoices);
  }

  calculatePhilosophicalDNA(choicesObj) {
    const choices = choicesObj || JSON.parse(localStorage.getItem('lumina_dilemma_choices') || '{}');
    const dilemmas = this.getDilemmas();

    const counts = {
      utilitarian: 0,
      deontologist: 0,
      stoic: 0,
      existentialist: 0
    };

    let totalAnswered = 0;
    dilemmas.forEach(d => {
      const ans = choices[d.id];
      if (ans) {
        totalAnswered++;
        const trait = ans === 'A' ? d.optionA.trait : d.optionB.trait;
        if (counts[trait] !== undefined) counts[trait]++;
      }
    });

    if (totalAnswered === 0) {
      return {
        answered: 0,
        dominantSchool: 'Henüz Belirlenmedi',
        description: 'Aşağıdaki etik ikilemleri yanıtlayarak zihinsel felsefi DNA haritanızı çıkarın.'
      };
    }

    let dominant = 'stoic';
    let max = -1;
    for (const [k, v] of Object.entries(counts)) {
      if (v > max) {
        max = v;
        dominant = k;
      }
    }

    const archetypes = {
      utilitarian: {
        title: 'FAYDACI & STRATEJİK PRAGMATİST (Bentham/Mill)',
        desc: 'Kararlarında neticeye ve en yüksek sayıda insanın faydasına odaklanıyorsun. Duygusallıktan uzak, rasyonel ve hesaplayıcı bir zihin yapın var.'
      },
      deontologist: {
        title: 'KANTÇI İLKELİ SAVAŞÇI (Immanuel Kant)',
        desc: 'Sonuç ne olursa olsun ahlaki ilkelerden ve görev bilincinden taviz vermezsin. Senin için kurallar ve dürüstlük her şeyin üzerindedir.'
      },
      stoic: {
        title: 'KADİM STOACI VE ERDEMLİ BİLGE (Marcus Aurelius/Seneca)',
        desc: 'Dış dünyanın onayından bağımsız kendi karakterine ve erdemine odaklanıyorsun. Kontrol edebileceğin tek şeyin kendi ruhun olduğunu biliyorsun.'
      },
      existentialist: {
        title: 'VAROLUŞÇU ASİ & ÜST-İNSAN (Nietzsche/Sartre)',
        desc: 'Kalıplaşmış dogmaları reddedip kendi anlamını ve kurallarını kendin yaratıyorsun. Cesaret ve otantiklik senin pusulandır.'
      }
    };

    return {
      answered: totalAnswered,
      dominantSchool: archetypes[dominant].title,
      description: archetypes[dominant].desc,
      stats: counts
    };
  }

  // ==========================================
  // 12. NEURO-WAVE BINAURAL FREQUENCY GENERATOR
  // ==========================================
  playBinauralBeat(carrierFreq, beatFreq, volume = 0.15) {
    this.stopBinauralBeat();

    try {
      if (window.LuminaAudio) {
        window.LuminaAudio.initContext();
        const ctx = window.LuminaAudio.ctx;
        if (!ctx) return;

        const leftOsc = ctx.createOscillator();
        const rightOsc = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const masterGain = ctx.createGain();

        leftOsc.frequency.setValueAtTime(carrierFreq, ctx.currentTime);
        rightOsc.frequency.setValueAtTime(carrierFreq + beatFreq, ctx.currentTime);

        leftOsc.type = 'sine';
        rightOsc.type = 'sine';

        leftOsc.connect(merger, 0, 0);
        rightOsc.connect(merger, 0, 1);

        merger.connect(masterGain);
        masterGain.connect(ctx.destination);

        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.0);

        leftOsc.start();
        rightOsc.start();

        this.binauralNodes = {
          leftOsc,
          rightOsc,
          masterGain
        };
      }
    } catch (e) {
      console.warn('Binaural beat error:', e);
    }
  }

  stopBinauralBeat() {
    try {
      if (this.binauralNodes && window.LuminaAudio && window.LuminaAudio.ctx) {
        const ctx = window.LuminaAudio.ctx;
        this.binauralNodes.masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.binauralNodes) {
            this.binauralNodes.leftOsc.stop();
            this.binauralNodes.rightOsc.stop();
            this.binauralNodes = null;
          }
        }, 550);
      }
    } catch (e) {
      console.warn('Stop binaural error:', e);
    }
  }
}

// Global Sanctum Instance
window.LuminaSanctum = new LuminaSanctumEngine();
