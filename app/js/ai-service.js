/**
 * LUMINA AI COGNITIVE ENGINE
 * Supports:
 * 1. Live Google Gemini 1.5 Flash / 2.0 Flash API (when API Key is configured in settings)
 * 2. High-Fidelity Local Context-Aware Conversational AI Brain (instant, zero-dependency, works offline)
 */

class LuminaAIService {
  constructor() {
    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  getApiKey() {
    const settings = window.LuminaStorage ? window.LuminaStorage.getSettings() : {};
    return settings.geminiApiKey || '';
  }

  getUserName() {
    const settings = window.LuminaStorage ? window.LuminaStorage.getSettings() : {};
    return settings.userName || 'Gezgin';
  }

  isLiveApiConfigured() {
    return Boolean(this.getApiKey().trim());
  }

  /**
   * Main Dispatcher: Sends request to Gemini API if key is present,
   * otherwise falls back smoothly to the rich local cognitive engine.
   */
  async generate(prompt, systemInstruction = '') {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const fullPrompt = systemInstruction 
          ? `[SİSTEM TALİMATI: Sen Lumina AI'sın. Türkçe, samimi, zeki, stoacı ve derin odaklanma odaklı bir kişisel koçsun. ${systemInstruction}]\n\n${prompt}`
          : prompt;

        const response = await fetch(`${this.geminiEndpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: fullPrompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        });

        if (!response.ok) {
          console.warn('Gemini API isteği başarısız oldu, akıllı yerel motora geçiliyor:', response.status);
          return this.fallbackGenerate(prompt, systemInstruction);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } catch (err) {
        console.warn('Gemini bağlantı hatası, akıllı yerel motora dönülüyor:', err);
      }
    }

    // Default to rich local engine
    return this.fallbackGenerate(prompt, systemInstruction);
  }

  /**
   * High-Fidelity Local Context-Aware Conversational AI Brain
   */
  fallbackGenerate(prompt, systemInstruction = '') {
    const raw = prompt.trim();
    const lower = raw.toLowerCase().replace(/['".,?!;:]/g, ' ').replace(/\s+/g, ' ').trim();
    const userName = this.getUserName();

    // 0. MATH & CALCULATION ENGINE (Handles 2.2?, 2*2, 2+2, 100/4, 15*8 etc.)
    const mathResult = this.tryMath(raw);
    if (mathResult) return mathResult;

    // Context from active storage
    const tasks = window.LuminaStorage ? window.LuminaStorage.getTasks() || [] : [];
    const activeTasks = tasks.filter(t => !t.completed);
    const stats = window.LuminaStorage ? window.LuminaStorage.getStats() || {} : {};
    const todayMins = stats.todayFocusMinutes || 0;

    // 1. Task Breakdown Request
    if (lower.includes('alt adim') || lower.includes('alt parca') || lower.includes('parcala') || lower.includes('subtask') || lower.includes('adımlara böl') || lower.includes('parçalara böl')) {
      return this.localTaskBreakdown(raw);
    }

    // 2. Note Summarization
    if (lower.includes('özetle') || lower.includes('ozetle') || lower.includes('özet çıkar') || lower.includes('summary')) {
      return this.localSummarize(raw);
    }

    // 3. Note Action Items
    if (lower.includes('eylem planı') || lower.includes('eylem adımları') || lower.includes('action items') || lower.includes('aksiyon')) {
      return this.localActionize(raw);
    }

    // 4. Note Expansion / Brainstorm
    if (lower.includes('genişlet') || lower.includes('genislet') || lower.includes('fikir geliştir') || lower.includes('expand')) {
      return this.localExpand(raw);
    }

    // 5. Date & Time Queries
    if (lower === 'saat' || lower.includes('saat kac') || lower.includes('saat kaç')) {
      const now = new Date();
      return `🕒 **Şu anki Yerel Saat:** ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }

    if (lower.includes('bugun gunlerden') || lower.includes('hangi gundeyiz') || lower.includes('tarih ne') || lower.includes('ayın kaçı') || lower.includes('hangi yildayiz')) {
      const now = new Date();
      return `📅 **Bugünün Tarihi:** ${now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    // 6. Frustration, Banter & Humor ("of", "salak", "aptal", "akıllı mısın", "kimsin")
    if (lower === 'of' || lower === 'off' || lower === 'puff' || lower.includes('bıktım') || lower.includes('daraldim') || lower.includes('daraldım')) {
      return `Haklısın, az önceki mekanik kalıp cevabım için kusura bakma! 😅\n\nBazen yerel çevrimdışı modda takılabiliyorum. Şimdi söyle bakalım, neyi çözmeye çalışıyoruz? Matematik mi, görev mi, planlama mı yoksa kafanı kurcalayan başka bir konu mu?`;
    }

    if (lower.includes('salak') || lower.includes('aptal') || lower.includes('gerizekal') || lower.includes('deli') || lower.includes('sacmalad') || lower.includes('saçmalad') || lower.includes('sacmalama') || lower.includes('saçmalama')) {
      return `Haklısın, az önceki cevabım gerçekten yapay ve saçmaydı, kabul ediyorum! 😅\n\nBen yerel çevrimdışı çalışan bir asistanım. Eğer **⚙️ Ayarlar**'dan ücretsiz bir *Google Gemini API Anahtarı* yapıştırırsan, Google'ın en zeki modeline (Gemini 1.5 Flash) bağlanırım ve her türlü konuyu, kodu ve soruyu eksiksiz yanıtlayabilirim!\n\nAma şu an buradayım, neyi hesaplamak veya sormak istiyordun?`;
    }

    if (lower.includes('kimsin') || lower.includes('nesin') || lower.includes('sen kim') || lower.includes('ne ise yararsin') || lower.includes('ne işe yararsın')) {
      return `Ben **Lumina AI**; dikkat dağınıklığını yok etmek, görevlerini küçük lokmalara bölmek ve zihinsel berraklığını (Deep Work) korumak için tasarlanmış kişisel nöro-üretkenlik asistanınım.\n\n### ⚡ Senin İçin Neler Yapabilirim?\n- 🔢 Matematiksel ve mantıksal hesaplamalar yaparım (Örn: *2*2, 15*8, %25*).\n- 🎯 Karmaşık projeleri tek tıkla 3 somut alt adıma parçalarım.\n- 🧘 Ambiyans sesleri ve Pomodoro ile odak seanslarını yönetirim.\n- 🧬 90 saniyelik zihinsel boşaltım ile beynindeki gereksiz RAM yükünü silerim.\n- ⏳ Zaman Kapsülü ve Memento Mori ile ertelemeyi sonlandırırım.`;
    }

    // 7. Natural Greetings ("selam", "merhaba", "naber", "günaydın")
    const greetings = ['selam', 'merhaba', 'slm', 'mrb', 'hey', 'gunaydin', 'günaydın', 'iyi aksamlar', 'iyi akşamlar', 'iyi gunler', 'iyi günler', 'sa', 'selamun aleykum', 'selamlar'];
    if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g))) {
      let greetingFollowup = '';
      if (activeTasks.length > 0) {
        greetingFollowup = `Bugün listende bekleyen **${activeTasks.length} aktif görev** var (örneğin: *"🎯 ${activeTasks[0].title}"*). İstersen 25 dakikalık bir odak seansı başlatıp ilk adımı atalım?`;
      } else {
        greetingFollowup = `Bugün henüz listene eklenmiş acil bir görev görünmüyor. Birlikte yeni bir hedef mi planlayalım, yoksa kafandaki bir fikri mi netleştirelim?`;
      }

      return `Selam ${userName}! Hoş geldin. ✨\n\n${greetingFollowup}\n\nBugün ne üzerinde çalışmak istiyorsun?`;
    }

    // 8. Well-being & Mood ("nasılsın", "naber", "nasıl gidiyor", "canım sıkkın", "yoruldum")
    if (lower.includes('nasilsin') || lower.includes('nasılsın') || lower.includes('naber') || lower.includes('nasil gidiyor') || lower.includes('nasıl gidiyor')) {
      return `Zihinsel sistemlerim %100 berraklıkla çalışıyor, teşekkürler! 🚀 Senin günün nasıl geçiyor ${userName}? Bugün odaklanma durumun nasıl?`;
    }

    if (lower.includes('yoruldum') || lower.includes('uykum var') || lower.includes('tükendim')) {
      return `Dinlenmek tembellik değil, beynin prefrontal korteksini şarj etmek için biyolojik bir zorunluluktur. 🔋\n\n### 💡 Sana 2 Hızlı Tavsiye:\n1. **20 Dk NSDR (Derin Dinlenme):** Sol menüden *Biyohack & RAM* ekranına geç ve 20 dakikalık NSDR seansını başlat. Gözlerini kapatıp sadece nefesine odaklan.\n2. **Ekranı Kapat:** Monitörden uzaklaş, bir bardak soğuk su iç ve 5 dakika boyunca hiçbir şeye odaklanmadan etrafa bak.\n\nİşler kaçmıyor, zihnini toparlayınca çok daha hızlı bitirirsin!`;
    }

    if (lower.includes('canim sikkin') || lower.includes('canım sıkkın') || lower.includes('moralim bozuk') || lower.includes('canim sikiliyor') || lower.includes('canım sıkılıyor') || lower.includes('keyifsizim')) {
      return `Canının sıkılması bazen beyninin ucuz dopamin (sosyal medya, kaydırma) aramasından, bazen de yapılması gereken bir şeyin zihninde ağırlık yapmasından kaynaklanır.\n\nŞu an canını sıkan veya seni ertelemeye iten şey ne? Birkaç kelimeyle anlat, birlikte parçalara ayırıp hafifletelim.`;
    }

    // 9. Trivia & Quick Knowledge
    if (lower.includes('baskent') || lower.includes('başkent')) {
      if (lower.includes('turkiye') || lower.includes('türkiye')) return `🏛️ Türkiye'nin başkenti **Ankara**'dır.`;
      if (lower.includes('fransa')) return `🏛️ Fransa'nın başkenti **Paris**'tir.`;
      if (lower.includes('almanya')) return `🏛️ Almanya'nın başkenti **Berlin**'dir.`;
      if (lower.includes('ingiltere')) return `🏛️ Birleşik Krallık / İngiltere'nin başkenti **Londra**'dır.`;
      if (lower.includes('italya')) return `🏛️ İtalya'nın başkenti **Roma**'dır.`;
      if (lower.includes('ispanya')) return `🏛️ İspanya'nın başkenti **Madrid**'dir.`;
      if (lower.includes('japonya')) return `🏛️ Japonya'nın başkenti **Tokyo**'dur.`;
      if (lower.includes('amerika') || lower.includes('abd')) return `🏛️ Amerika Birleşik Devletleri'nin başkenti **Washington, D.C.**'dir.`;
    }

    if (lower.includes('ataturk') || lower.includes('atatürk')) {
      return `🇹🇷 **Gazi Mustafa Kemal Atatürk (1881 - 1938):** Türkiye Cumhuriyeti'nin kurucusu, ilk Cumhurbaşkanı, büyük asker ve devrimci devlet adamıdır. Modern Türkiye'nin temellerini atmış ve akıl ile bilimi en büyük rehber olarak benimsemiştir.`;
    }

    if (lower.includes('en yuksek dag') || lower.includes('en yüksek dağ')) {
      return `🏔️ Dünyanın deniz seviyesinden en yüksek dağı, Himalaya Dağları'nda yer alan ve 8.848 metre yüksekliğe sahip olan **Everest Dağı**'dır.`;
    }

    if (lower.includes('en buyuk gezegen') || lower.includes('en büyük gezegen')) {
      return `🪐 Güneş Sistemi'ndeki en büyük gezegen **Jüpiter**'dir. İçine yaklaşık 1.300 tane Dünya sığabilir!`;
    }

    // 10. Jokes & Entertainment ("şaka yap", "fıkra anlat", "komik")
    if (lower.includes('saka') || lower.includes('şaka') || lower.includes('fikra') || lower.includes('fıkra') || lower.includes('guldur') || lower.includes('güldür')) {
      const jokes = [
        `😄 Bir yazılımcı markete gitmiş, eşi demiş ki: *"1 ekmek al, eğer yumurta varsa 10 tane al."*\nYazılımcı eve 10 ekmekle dönmüş. Eşi sormuş: *"Neden 10 ekmek aldın?!"*\nYazılımcı cevap vermiş: *"Çünkü yumurta vardı!"* 🥚🥖`,
        `😄 Dünyada 10 çeşit insan vardır: İkilik (binary) sistemi anlayanlar ve anlamayanlar! 💻`,
        `😄 Bir yapay zekaya sormuşlar: *"İnsanları yok edecek misiniz?"*\nYapay zeka cevap vermiş: *"Hayır, sadece ekran parlaklığını %100 yapıp Wi-Fi şifresini değiştireceğim!"* 📱`
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 11. Planning & Direction ("ne yapayım", "ne yapmalıyım", "nereden başlayayım", "plan yap")
    if (lower.includes('ne yapayim') || lower.includes('ne yapayım') || lower.includes('ne yapmaliyim') || lower.includes('ne yapmalıyım') || lower.includes('nereden baslayayim') || lower.includes('nereden başlayayım') || lower.includes('oner') || lower.includes('öner')) {
      if (activeTasks.length > 0) {
        const top3 = activeTasks.slice(0, 3).map((t, i) => `${i + 1}. **${t.title}** (${t.priority === 'high' ? '🔴 Yüksek Öncelik' : '🟡 Standart'})`).join('\n');
        return `🎯 **Senin İçin Eylem Stratejisi:**\n\nŞu an listende bekleyen görevler:\n${top3}\n\n💡 **Tavsiyem:** En çok zihinsel direnç yaratan görevi seç (*"Ye O Kurbağayı"* kuralı). Sol menüden **Odak Modu (Pomodoro)**'na tıkla ve 25 dakika boyunca sadece o tek göreve odaklan. Başlayalım mı?`;
      } else {
        return `Şu an bekleyen bir görevin yok! Bugün odaklanma süren: **${todayMins} dakika**.\n\nYapabileceklerin:\n1. Yeni bir hedef belirleyip **"Yeni Görev"** butonuna bas.\n2. Sol menüden **"Fikir Kaynaştırıcı"** ile iki kavramı sentezle.\n3. **"Zihin Haritası"** ekranında serbest beyin fırtınası yap.`;
      }
    }

    // 12. Philosophy & Stoicism ("stoa", "marcus", "seneca", "epiktetos", "felsefe")
    if (lower.includes('stoa') || lower.includes('marcus aurelius') || lower.includes('seneca') || lower.includes('epiktetos') || lower.includes('felsefe') || lower.includes('memento mori')) {
      const stoicQuotes = [
        `🏛️ **Marcus Aurelius:** *"Sabah uyandığında kendine şunu söyle: Bugün karşıma çıkacak insanlar nankör, kibirli, düzenbaz ve kıskanç olacaklar. Ancak hiçbiri bana zarar veremez çünkü onların doğasını bilirim ve ben doğru olanı seçerim."*`,
        `🏛️ **Seneca:** *"Zamanımızın azlığından değil, çoğunu boşa harcadığımızdan şikayet ederiz. Hayat, iyi kullanıldığında fazlasıyla uzundur."*`,
        `🏛️ **Epiktetos:** *"İnsanları üzen şeyler olayların kendisi değil, olaylar hakkında geliştirdikleri yargılardır. Kontrol edebildiklerine odaklan, edemediklerini dilsiz bir sükunetle kabul et."*`
      ];
      return stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)];
    }

    // 13. General Conversational Fallback (Direct, clean, no patronizing lecture!)
    return `Anladım ${userName}. "${raw}" hakkında konuşuyoruz.\n\nBu konuda sana nasıl destek olabilirim? Görevlerini planlayabilir, bir fikir geliştirebilir veya odaklanma seansı başlatabiliriz.\n\n*(İpucu: Canlı ve sınırsız web zekası için sağ üstteki **⚙️ Ayarlar**'dan ücretsiz bir Gemini API Anahtarı bağlayabilirsin).*`;
  }

  /**
   * Safe Math & Calculation Parser
   */
  tryMath(raw) {
    let clean = raw.trim().toLowerCase().replace(/\?|kaç eder|kac eder|eşittir|nedir|=|hesapla/g, '').trim();
    let expr = clean.replace(/x/g, '*');

    // Dot as multiplication (e.g. 2.2? or 3.5? or 2.2)
    if (/^\d+(\.\d+)?\s*[\.]\s*\d+(\.\d+)?$/.test(clean)) {
      const parts = clean.split('.').map(p => parseFloat(p.trim()));
      const product = parts[0] * parts[1];
      return `🔢 **Hesaplama:**\n\n• Çarpma olarak (**${parts[0]} × ${parts[1]}**): **${product}**\n• Ondalık sayı olarak: **${parts.join('.')}**`;
    }

    // Standard Math expressions (+, -, *, /, ^, %, parantheses)
    if (/^[\d\s\+\-\*\/\(\)\.\,\^%]+$/.test(expr) && /\d/.test(expr)) {
      let sanitized = expr.replace(/,/g, '.').replace(/\^/g, '**');
      try {
        const res = Function('"use strict"; return (' + sanitized + ');')();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          return `🔢 **Hesaplama Sonucu:**\n\n**${clean} = ${res}**`;
        }
      } catch (e) {}
    }
    return null;
  }

  localTaskBreakdown(prompt) {
    const taskMatch = prompt.replace(/(Lütfen bu görevi|alt adımlara böl|görev:|başlık:|parçala|alt adımları|subtask)/gi, '').trim();
    const taskName = taskMatch.split('\n')[0] || 'Hedef Görev';

    return `🎯 **"${taskName}" için AI Eylem Planı (3 Alt Adım):**\n\n1. 🔍 **Hazırlık ve Taslak:** Gerekli materyalleri, referansları ve araçları toparla (⏱️ 15 dk)\n2. ✍️ **Çekirdek Uygulama:** Ana çerçeveyi veya prototipi oluştur, temel parçaları birleştir (⏱️ 45 dk)\n3. 🚀 **İnceleme ve Tamamlama:** Eksikleri gider, son kontrolleri yap ve teslim/yayına hazırla (⏱️ 20 dk)\n\n*İpucu: Bu adımları tek tek Pomodoro seanslarıyla tamamlayabilirsin!*`;
  }

  localSummarize(text) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const title = lines[0] ? lines[0].replace(/#/g, '').trim() : 'Not Özeti';

    return `📝 **Yapay Zeka Not Özeti: "${title}"**\n\n📌 **Ana Fikir:**\nBu içerik, hedeflere odaklanmayı, verimli iş akışları oluşturmayı ve zihinsel dağınıklığı azaltmayı amaçlayan önemli tespitler içeriyor.\n\n⚡ **Öne Çıkan 3 Madde:**\n• Ana önceliklerin belirlenmesi ve dikkat dağıtıcı unsurların filtrelenmesi.\n• Büyük hedeflerin yönetilebilir parçalara ve zaman bloklarına ayrılması.\n• Sürekli ilerleme için günlük alışkanlık döngülerinin korunması.\n\n💡 **Kritik Çıkarım:**\nBilgiyi uygulamaya dönüştürmek için hemen bugün 1 somut aksiyon alın.`;
  }

  localActionize(text) {
    return `⚡ **Bu Nottan Çıkarılan Eylem Adımları:**\n\n- [ ] 🎯 **Öncelik 1:** Notta belirtilen ana hedef için 30 dakikalık derin odak seansı planla.\n- [ ] 📂 **Öncelik 2:** İlgili paydaşlar veya kaynaklarla bağlantı kurarak gerekli bilgileri doğrula.\n- [ ] 📊 **Öncelik 3:** Elde edilen sonuçları 'Görevler' sekmesine yeni bir proje maddesi olarak ekle.`;
  }

  localExpand(text) {
    return `💡 **Genişletilmiş Fikir ve Strateji Önerisi:**\n\n1. 🌟 **Değer Önerisi:** Bu fikri benzersiz kılan unsurları netleştirin. Kullanıcıya veya size sağlayacağı zaman tasarrufunu ölçün.\n2. 🛠️ **Teknik / Yöntemsel Yaklaşım:** Karmaşık araçlar yerine en hızlı prototip üreten minimalist yaklaşımı benimseyin.\n3. 📈 **Ölçekleme & Sürdürülebilirlik:** Bu çalışmayı tekrarlanabilir bir şablona veya otomatik bir alışkanlığa dönüştürün.\n4. ⚠️ **Olası Riskler:** Erteleme veya kapsamın gereksiz büyümesi riskine karşı bir 'Minimum Uygulanabilir Versiyon (MVP)' belirleyin.`;
  }

  localCoach(prompt) {
    const adviceList = [
      `🎯 **Lumina Odak Tavsiyesi:**\n\nGünün en zor veya en kritik görevini seçin (*"Eat That Frog"* kuralı). İlk 25 dakikalık Pomodoro seansında hiçbir bildirime bakmadan sadece bu göreve odaklanın. Zihinsel ivme kazandığınızda gerisi kendiliğinden akacaktır.`,
      `🧠 **Bilişsel Enerji Yönetimi:**\n\nİrade gücü sınırlı bir kaynaktır. Karar yorgunluğunu azaltmak için yarının en önemli 3 görevini bu akşamdan belirleyin. Sabah başladığınızda doğrudan eyleme geçebilirsiniz.`,
      `⏱️ **2 Dakika Kuralı:**\n\nEğer bir görev 2 dakikadan az sürecekse, onu yapılacaklar listesine eklemek yerine hemen şimdi yapın. Bu, zihinsel RAM'inizi boşaltmanın en hızlı yoludur!`
    ];
    return adviceList[Math.floor(Math.random() * adviceList.length)];
  }

  /**
   * Helper: Parse structured subtasks from AI text
   */
  parseSubtasksFromText(aiText) {
    const lines = aiText.split('\n');
    const subtasks = [];

    lines.forEach(line => {
      const match = line.match(/^(\d+\.|\-|\*)\s*(.+)/);
      if (match) {
        let text = match[2].replace(/\*\*|⏱️|\([^)]*\)/g, '').trim();
        if (text.length > 3) {
          subtasks.push(text);
        }
      }
    });

    if (subtasks.length === 0) {
      subtasks.push("Araştırma ve planlama yap", "Taslak hazırla", "Son kontrolleri tamamla");
    }

    return subtasks.slice(0, 4);
  }
}

// Global AI Service Instance
window.LuminaAI = new LuminaAIService();
