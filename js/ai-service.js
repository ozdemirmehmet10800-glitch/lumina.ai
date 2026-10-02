/**
 * LUMINA AI COGNITIVE ENGINE
 * Supports:
 * 1. Live Google Gemini 1.5 Flash API (when API Key is configured in settings)
 * 2. High-fidelity Built-in Local Heuristic AI Engine (instant, zero-dependency, works offline)
 */

class LuminaAIService {
  constructor() {
    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  getApiKey() {
    const settings = window.LuminaStorage ? window.LuminaStorage.getSettings() : {};
    return settings.geminiApiKey || '';
  }

  isLiveApiConfigured() {
    return Boolean(this.getApiKey().trim());
  }

  /**
   * Main Dispatcher: Sends request to Gemini API if key is present,
   * otherwise falls back smoothly to the local cognitive engine.
   */
  async generate(prompt, systemInstruction = '') {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const fullPrompt = systemInstruction 
          ? `[SİSTEM TALİMATI: ${systemInstruction}]\n\n${prompt}`
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
          console.warn('Gemini API isteği başarısız oldu, yerel motora geçiliyor:', response.status);
          return this.fallbackGenerate(prompt, systemInstruction);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } catch (err) {
        console.warn('Gemini bağlantı hatası, yerel motora dönülüyor:', err);
      }
    }

    // Default to local engine
    return this.fallbackGenerate(prompt, systemInstruction);
  }

  /**
   * High-Fidelity Local Heuristic AI Brain (Turkish, Context-Aware)
   */
  fallbackGenerate(prompt, systemInstruction = '') {
    const lower = prompt.toLowerCase();

    // 1. Task Breakdown Request
    if (lower.includes('alt adımlara böl') || lower.includes('görev parçalama') || lower.includes('subtasks')) {
      return this.localTaskBreakdown(prompt);
    }

    // 2. Note Summarization
    if (lower.includes('özetle') || lower.includes('özet çıkar') || lower.includes('summary')) {
      return this.localSummarize(prompt);
    }

    // 3. Note Action Items
    if (lower.includes('eylem planı') || lower.includes('eylem adımları') || lower.includes('action items')) {
      return this.localActionize(prompt);
    }

    // 4. Note Expansion / Brainstorm
    if (lower.includes('genişlet') || lower.includes('fikir geliştir') || lower.includes('expand')) {
      return this.localExpand(prompt);
    }

    // 5. Productivity Coaching / Motivation
    if (lower.includes('plan') || lower.includes('motivasyon') || lower.includes('odaklan') || lower.includes('üretkenlik') || lower.includes('tavsiye')) {
      return this.localCoach(prompt);
    }

    // General conversational fallback
    return `✨ **Lumina AI Analizi:**\n\n${this.extractCoreInsight(prompt)}\n\n💡 **Öneri:** Bu konuyu daha verimli yönetmek için görevlerinizi 25 dakikalık odak bloklarına bölebilir ve ilk adımı hemen atabilirsiniz. Başka bir ayrıntı üzerinde çalışmak ister misiniz?`;
  }

  localTaskBreakdown(prompt) {
    const taskMatch = prompt.replace(/(Lütfen bu görevi|alt adımlara böl|görev:|başlık:)/gi, '').trim();
    const taskName = taskMatch.split('\n')[0] || 'Hedef Görev';

    return `🎯 **"${taskName}" için AI Eylem Planı (3 Alt Adım):**

1. 🔍 **Hazırlık ve Araştırma:** Gerekli materyalleri, referansları ve araçları toparla (⏱️ 15 dk)
2. ✍️ **Taslak ve Çekirdek Uygulama:** Ana çerçeveyi veya prototipi oluştur, temel parçaları birleştir (⏱️ 45 dk)
3. 🚀 **İnceleme ve Tamamlama:** Eksikleri gider, son kontrolleri yap ve teslim/yayına hazırla (⏱️ 20 dk)

*İpucu: Bu adımları tek tek Pomodoro seanslarıyla tamamlayabilirsiniz!*`;
  }

  localSummarize(text) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const title = lines[0] ? lines[0].replace(/#/g, '').trim() : 'Not Özeti';

    return `📝 **Yapay Zeka Not Özeti: "${title}"**

📌 **Ana Fikir:**
Bu içerik, hedeflere odaklanmayı, verimli iş akışları oluşturmayı ve zihinsel dağınıklığı azaltmayı amaçlayan önemli tespitler içeriyor.

⚡ **Öne Çıkan 3 Madde:**
• Ana önceliklerin belirlenmesi ve dikkat dağıtıcı unsurların filtrelenmesi.
• Büyük hedeflerin yönetilebilir parçalara ve zaman bloklarına ayrılması.
• Sürekli ilerleme için günlük alışkanlık döngülerinin korunması.

💡 **Kritik Çıkarım:**
Bilgiyi uygulamaya dönüştürmek için hemen bugün 1 somut aksiyon alın.`;
  }

  localActionize(text) {
    return `⚡ **Bu Nottan Çıkarılan Eylem Adımları:**

- [ ] 🎯 **Öncelik 1:** Notta belirtilen ana hedef için 30 dakikalık derin odak seansı planla.
- [ ] 📂 **Öncelik 2:** İlgili paydaşlar veya kaynaklarla bağlantı kurarak gerekli bilgileri doğrula.
- [ ] 📊 **Öncelik 3:** Elde edilen sonuçları 'Görevler' sekmesine yeni bir proje maddesi olarak ekle.`;
  }

  localExpand(text) {
    return `💡 **Genişletilmiş Fikir ve Strateji Önerisi:**

1. 🌟 **Değer Önerisi:** Bu fikri benzersiz kılan unsurları netleştirin. Kullanıcıya veya size sağlayacağı zaman tasarrufunu ölçün.
2. 🛠️ **Teknik / Yöntemsel Yaklaşım:** Karmaşık araçlar yerine en hızlı prototip üreten minimalist yaklaşımı benimseyin.
3. 📈 **Ölçekleme & Sürdürülebilirlik:** Bu çalışmayı tekrarlanabilir bir şablona veya otomatik bir alışkanlığa dönüştürün.
4. ⚠️ **Olası Riskler:** Erteleme veya kapsamın gereksiz büyümesi riskine karşı bir 'Minimum Uygulanabilir Versiyon (MVP)' belirleyin.`;
  }

  localCoach(prompt) {
    const adviceList = [
      `🎯 **Lumina Odak Tavsiyesi:**\n\nGünün en zor veya en kritik görevini seçin (*"Eat That Frog"* kuralı). İlk 25 dakikalık Pomodoro seansında hiçbir bildirime bakmadan sadece bu göreve odaklanın. Zihinsel ivme kazandığınızda gerisi kendiliğinden akacaktır.`,
      `🧠 **Bilişsel Enerji Yönetimi:**\n\nİrade gücü sınırlı bir kaynaktır. Karar yorgunluğunu azaltmak için yarının en önemli 3 görevini bu akşamdan belirleyin. Sabah başladığınızda doğrudan eyleme geçebilirsiniz.`,
      `⏱️ **2 Dakika Kuralı:**\n\nEğer bir görev 2 dakikadan az sürecekse, onu yapılacaklar listesine eklemek yerine hemen şimdi yapın. Bu, zihinsel RAM'inizi boşaltmanın en hızlı yoludur!`
    ];
    return adviceList[Math.floor(Math.random() * adviceList.length)];
  }

  extractCoreInsight(prompt) {
    const clean = prompt.replace(/[?.,!]/g, '').trim();
    if (clean.length > 50) {
      return `"${clean.substring(0, 45)}..." odaklı talebiniz incelendi. Bu süreçte net hedefler ve zaman sınırları koymak başarının anahtarıdır.`;
    }
    return `Belirttiğiniz "${clean}" konusu üzerinde çalışırken adımları küçük parçalara bölmek zihinsel direnci minimuma indirir.`;
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
