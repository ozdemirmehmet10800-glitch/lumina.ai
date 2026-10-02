/**
 * LUMINA STORAGE MANAGER
 * Handles state persistence via LocalStorage, seed data initialization,
 * and JSON data export/import capabilities.
 */

class LuminaStorageManager {
  constructor() {
    this.KEYS = {
      TASKS: 'lumina_tasks_v1',
      NOTES: 'lumina_notes_v1',
      HABITS: 'lumina_habits_v1',
      STATS: 'lumina_stats_v1',
      SETTINGS: 'lumina_settings_v1',
      CHAT_HISTORY: 'lumina_chat_history_v1'
    };

    this.initSeedDataIfEmpty();
  }

  initSeedDataIfEmpty() {
    // 1. Seed Tasks
    if (!localStorage.getItem(this.KEYS.TASKS)) {
      const initialTasks = [
        {
          id: 'task-1',
          title: 'Yeni Projenin Sistem Mimarisi Şemasını Çıkar',
          description: 'Frontend bileşenleri, veri akışı ve AI entegrasyonu planlanacak.',
          priority: 'high',
          category: 'Yazılım',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          completed: false,
          createdAt: Date.now() - 3600000,
          subtasks: [
            { text: 'Veritabanı ve yerel depolama modelini tanımla', done: true },
            { text: 'Web Audio API ses filtrelerini test et', done: true },
            { text: 'AI prompt şablonlarını optimize et', done: false }
          ]
        },
        {
          id: 'task-2',
          title: 'Haftalık Sprint Önceliklerini Belirle',
          description: 'Ekip içi hedef hizalaması ve bloklayıcı sorunların tespiti.',
          priority: 'medium',
          category: 'Strateji',
          dueDate: new Date().toISOString().split('T')[0],
          completed: false,
          createdAt: Date.now() - 7200000,
          subtasks: [
            { text: 'Geciken görevleri listele', done: true },
            { text: 'Kritik 3 ana hedefi seç', done: false }
          ]
        },
        {
          id: 'task-3',
          title: 'Deep Work: 50 Dakikalık Odak Seansı',
          description: 'Arka planda yağmur sesi eşliğinde kesintisiz kodlama.',
          priority: 'low',
          category: 'Kişisel',
          dueDate: new Date().toISOString().split('T')[0],
          completed: true,
          createdAt: Date.now() - 14400000,
          subtasks: []
        }
      ];
      this.saveTasks(initialTasks);
    }

    // 2. Seed Notes
    if (!localStorage.getItem(this.KEYS.NOTES)) {
      const initialNotes = [
        {
          id: 'note-1',
          title: '🚀 Derin Çalışma (Deep Work) ve Zihinsel Modeller',
          content: `# Derin Çalışma ve Zihinsel Odak Rehberi\n\nBaşarı, ne kadar çalıştığınızla değil, ne kadar kesintisiz odaklandığınızla doğru orantılıdır.\n\n### ⚡ 3 Temel Prensip:\n1. **Dikkat Kalıntılarını Sıfırla:** Görevler arasında hızlı geçiş yapmak yerine, en az 25 dakikalık tekil bloklar belirle.\n2. **Sıkılmayı Kucakla:** Boş anlarda hemen telefona sarılmak yerine beynin dinlenmesine ve dağınık düşünce moduna (diffuse mode) izin ver.\n3. **Gün Sonu Kapanış Ritüeli:** Her çalışma gününü net bir özetle bitir ve zihnini serbest bırak.\n\n> "Üretkenlik, daha fazla şey yapmak değil; doğru şeyleri yapmaktır."`,
          tags: ['Üretkenlik', 'Zihin'],
          updatedAt: Date.now() - 1800000
        },
        {
          id: 'note-2',
          title: '💡 Lumina AI ile Akıllı Otomasyon Fikirleri',
          content: `# Akıllı İş Akışları Notu\n\n- Görevleri tek tıkla 3 somut alt adıma parçala.\n- Uzun toplantı ve ders notlarını 30 saniyede eylem maddelerine dönüştür.\n- Ambiyans sesleri (Yağmur + Alfa dalgası) ile dikkat dağınıklığını engelle.`,
          tags: ['AI', 'Fikirler'],
          updatedAt: Date.now() - 7200000
        }
      ];
      this.saveNotes(initialNotes);
    }

    // 3. Seed Habits
    if (!localStorage.getItem(this.KEYS.HABITS)) {
      const initialHabits = [
        { id: 'h-1', name: '💧 2.5 Litre Su İç', streak: 5, days: [true, true, true, true, true, false, false] },
        { id: 'h-2', name: '📚 25 Dk Kitap Oku', streak: 4, days: [true, false, true, true, true, false, false] },
        { id: 'h-3', name: '🧘 Sabah Meditasyonu', streak: 7, days: [true, true, true, true, true, true, true] },
        { id: 'h-4', name: '⚡ 2 Seans Pomodoro', streak: 3, days: [false, true, true, true, false, false, false] }
      ];
      this.saveHabits(initialHabits);
    }

    // 4. Seed Stats
    if (!localStorage.getItem(this.KEYS.STATS)) {
      const initialStats = {
        totalFocusMinutes: 125,
        todayFocusMinutes: 50,
        tasksCompletedAllTime: 14,
        tasksCompletedToday: 3,
        weeklyFocusHistory: [45, 60, 30, 75, 50, 0, 0] // Mon to Sun
      };
      this.saveStats(initialStats);
    }

    // 5. Seed Settings
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      const initialSettings = {
        userName: 'Gezgin',
        theme: 'dark',
        geminiApiKey: '',
        pomodoro: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          soundEnabled: true
        }
      };
      this.saveSettings(initialSettings);
    }
  }

  // --- Task Methods ---
  getTasks() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.TASKS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveTasks(tasks) {
    localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
  }

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: 'task-' + Date.now(),
      title: task.title.trim(),
      description: (task.description || '').trim(),
      priority: task.priority || 'medium',
      category: task.category || 'Genel',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: Date.now(),
      subtasks: task.subtasks || []
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  toggleTask(id) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks(tasks);

      // Update stats if completed
      if (task.completed) {
        const stats = this.getStats();
        stats.tasksCompletedAllTime = (stats.tasksCompletedAllTime || 0) + 1;
        stats.tasksCompletedToday = (stats.tasksCompletedToday || 0) + 1;
        this.saveStats(stats);
      }
    }
    return task;
  }

  deleteTask(id) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  updateTaskSubtasks(id, subtasks) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.subtasks = subtasks;
      this.saveTasks(tasks);
    }
    return task;
  }

  // --- Note Methods ---
  getNotes() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.NOTES)) || [];
    } catch (e) {
      return [];
    }
  }

  saveNotes(notes) {
    localStorage.setItem(this.KEYS.NOTES, JSON.stringify(notes));
  }

  addNote(title = 'Yeni Not', content = '') {
    const notes = this.getNotes();
    const newNote = {
      id: 'note-' + Date.now(),
      title: title.trim(),
      content: content,
      tags: ['Genel'],
      updatedAt: Date.now()
    };
    notes.unshift(newNote);
    this.saveNotes(notes);
    return newNote;
  }

  updateNote(id, updates) {
    const notes = this.getNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      Object.assign(note, updates);
      note.updatedAt = Date.now();
      this.saveNotes(notes);
    }
    return note;
  }

  deleteNote(id) {
    const notes = this.getNotes().filter(n => n.id !== id);
    this.saveNotes(notes);
  }

  // --- Habit Methods ---
  getHabits() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.HABITS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveHabits(habits) {
    localStorage.setItem(this.KEYS.HABITS, JSON.stringify(habits));
  }

  addHabit(name) {
    const habits = this.getHabits();
    const newHabit = {
      id: 'h-' + Date.now(),
      name: name.trim(),
      streak: 0,
      days: [false, false, false, false, false, false, false]
    };
    habits.push(newHabit);
    this.saveHabits(habits);
    return newHabit;
  }

  toggleHabitDay(habitId, dayIndex) {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === habitId);
    if (habit && habit.days) {
      habit.days[dayIndex] = !habit.days[dayIndex];
      // Recalculate streak
      let currentStreak = 0;
      for (let i = habit.days.length - 1; i >= 0; i--) {
        if (habit.days[i]) currentStreak++;
        else break;
      }
      habit.streak = currentStreak;
      this.saveHabits(habits);
    }
    return habit;
  }

  deleteHabit(id) {
    const habits = this.getHabits().filter(h => h.id !== id);
    this.saveHabits(habits);
  }

  // --- Stats Methods ---
  getStats() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.STATS)) || {};
    } catch (e) {
      return {};
    }
  }

  saveStats(stats) {
    localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
  }

  addFocusMinutes(minutes) {
    const stats = this.getStats();
    stats.totalFocusMinutes = (stats.totalFocusMinutes || 0) + minutes;
    stats.todayFocusMinutes = (stats.todayFocusMinutes || 0) + minutes;

    // Update current day in weekly chart
    const todayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    if (!stats.weeklyFocusHistory) {
      stats.weeklyFocusHistory = [0, 0, 0, 0, 0, 0, 0];
    }
    stats.weeklyFocusHistory[todayIndex] = (stats.weeklyFocusHistory[todayIndex] || 0) + minutes;

    this.saveStats(stats);
    return stats;
  }

  // --- Settings Methods ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {};
    } catch (e) {
      return {};
    }
  }

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  }

  // --- Chat History Methods ---
  getChatHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CHAT_HISTORY)) || [];
    } catch (e) {
      return [];
    }
  }

  saveChatHistory(history) {
    localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(history.slice(-30)));
  }

  // --- Backup & Restore ---
  exportBackup() {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      habits: this.getHabits(),
      stats: this.getStats(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.notes) this.saveNotes(data.notes);
      if (data.habits) this.saveHabits(data.habits);
      if (data.stats) this.saveStats(data.stats);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (err) {
      console.error('Import hatası:', err);
      return false;
    }
  }
}

// Global Storage Instance
window.LuminaStorage = new LuminaStorageManager();
