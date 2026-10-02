/**
 * LUMINA AI - MAIN CONTROLLER APPLICATION
 * Comprehensive interactive logic for Dashboard, Tasks, Notes, Pomodoro,
 * Habit Matrix, AI Copilot, Command Palette and Audio System.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STATE & INITIALIZATION
  // ==========================================
  const state = {
    currentView: 'dashboard',
    activeNoteId: null,
    taskFilter: 'all',
    timer: {
      mode: 'pomodoro', // 'pomodoro' | 'shortBreak' | 'longBreak'
      duration: 25 * 60,
      remaining: 25 * 60,
      isRunning: false,
      intervalId: null
    },
    settings: window.LuminaStorage.getSettings()
  };

  // Apply Theme Immediately
  applyTheme(state.settings.theme || 'dark');

  // ==========================================
  // 2. DOM REFERENCES
  // ==========================================
  const dom = {
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    viewSections: document.querySelectorAll('.view-section'),
    sidebar: document.getElementById('sidebar'),
    menuToggleBtn: document.getElementById('menu-toggle-btn'),

    // Topbar & Clock
    searchCommandBtn: document.getElementById('search-command-btn'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    topbarAiBtn: document.getElementById('topbar-ai-btn'),
    quickNewTaskBtn: document.getElementById('quick-new-task-btn'),
    liveClock: document.getElementById('live-clock'),
    liveDate: document.getElementById('live-date'),
    greetingTitle: document.getElementById('greeting-title'),

    // Dashboard Elements
    dashStatCompleted: document.getElementById('stat-completed-tasks'),
    dashStatFocusTime: document.getElementById('stat-focus-time'),
    dashStatNotesCount: document.getElementById('stat-notes-count'),
    dashStatEfficiency: document.getElementById('stat-efficiency-score'),
    dashMiniTaskList: document.getElementById('dash-mini-task-list'),
    dashHabitList: document.getElementById('dash-habit-list'),
    dashAiPromptStrip: document.getElementById('dash-ai-prompt-strip'),

    // Tasks Elements
    taskMainInput: document.getElementById('task-main-input'),
    taskCategorySelect: document.getElementById('task-category-select'),
    taskPrioritySelect: document.getElementById('task-priority-select'),
    taskDueDateInput: document.getElementById('task-due-date-input'),
    btnAddTask: document.getElementById('btn-add-task'),
    taskFilterTabs: document.querySelectorAll('.task-filter-tabs .filter-tab'),
    taskFullList: document.getElementById('task-full-list'),

    // Notes Elements
    notesListScroll: document.getElementById('notes-list-scroll'),
    notesSearchInput: document.getElementById('notes-search-input'),
    btnNewNote: document.getElementById('btn-new-note'),
    noteTitleInput: document.getElementById('note-title-input'),
    noteBodyTextarea: document.getElementById('note-body-textarea'),
    noteWordCount: document.getElementById('note-word-count'),
    noteLastUpdated: document.getElementById('note-last-updated'),
    btnNoteSummarize: document.getElementById('btn-note-summarize'),
    btnNoteActionize: document.getElementById('btn-note-actionize'),
    btnNoteExpand: document.getElementById('btn-note-expand'),
    btnDeleteNote: document.getElementById('btn-delete-note'),

    // Pomodoro Timer Elements
    timerDisplayTime: document.getElementById('timer-display-time'),
    timerStatusText: document.getElementById('timer-status-text'),
    timerCircleProgress: document.getElementById('timer-circle-progress'),
    btnToggleTimer: document.getElementById('btn-toggle-timer'),
    btnResetTimer: document.getElementById('btn-reset-timer'),
    btnZenMode: document.getElementById('btn-zen-mode'),
    timerModeBtns: document.querySelectorAll('.timer-mode-selector .mode-btn'),

    // Zen Mode
    zenOverlay: document.getElementById('zen-overlay'),
    zenDisplayTime: document.getElementById('zen-display-time'),
    zenExitBtn: document.getElementById('zen-exit-btn'),
    zenTaskTitle: document.getElementById('zen-task-title'),

    // Ambient Sound Elements
    soundToggles: {
      rain: document.getElementById('sound-toggle-rain'),
      fire: document.getElementById('sound-toggle-fire'),
      wind: document.getElementById('sound-toggle-wind'),
      binaural: document.getElementById('sound-toggle-binaural')
    },
    soundVolumes: {
      rain: document.getElementById('vol-rain'),
      fire: document.getElementById('vol-fire'),
      wind: document.getElementById('vol-wind'),
      binaural: document.getElementById('vol-binaural')
    },

    // Habits & Analytics Elements
    habitTableBody: document.getElementById('habit-table-body'),
    habitNameInput: document.getElementById('habit-name-input'),
    btnAddHabit: document.getElementById('btn-add-habit'),
    chartBarsGroup: document.getElementById('chart-bars-group'),

    // AI Copilot Drawer
    aiCopilotDrawer: document.getElementById('ai-copilot-drawer'),
    closeCopilotBtn: document.getElementById('close-copilot-btn'),
    floatingAiTrigger: document.getElementById('floating-ai-trigger'),
    copilotMessages: document.getElementById('copilot-messages'),
    copilotInput: document.getElementById('copilot-input'),
    copilotSendBtn: document.getElementById('copilot-send-btn'),

    // Command Palette
    cmdPaletteBackdrop: document.getElementById('cmd-palette-backdrop'),
    cmdSearchInput: document.getElementById('cmd-search-input'),
    cmdResultsList: document.getElementById('cmd-results-list'),

    // Settings Dialog
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    settingUserName: document.getElementById('setting-user-name'),
    settingTheme: document.getElementById('setting-theme'),
    settingGeminiKey: document.getElementById('setting-gemini-key'),
    settingWorkDuration: document.getElementById('setting-work-duration'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    btnExportData: document.getElementById('btn-export-data'),
    btnImportData: document.getElementById('btn-import-data'),
    importFileInput: document.getElementById('import-file-input'),

    // Toast Container
    toastContainer: document.getElementById('toast-container'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // ==========================================
  // 3. NAVIGATION CONTROLLER
  // ==========================================
  function switchView(viewName) {
    state.currentView = viewName;

    dom.navItems.forEach(item => {
      const target = item.getAttribute('data-view');
      item.classList.toggle('active', target === viewName);
    });

    dom.viewSections.forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });

    // Close mobile sidebar if open
    if (dom.sidebar) {
      dom.sidebar.classList.remove('mobile-open');
    }

    // Refresh view-specific content
    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'tasks') renderTasks();
    if (viewName === 'notes') renderNotes();
    if (viewName === 'focus') updateTimerDisplay();
    if (viewName === 'habits') renderHabitsAndChart();
    if (viewName === 'sanctum') initSanctumView();
  }

  dom.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  if (dom.menuToggleBtn) {
    dom.menuToggleBtn.addEventListener('click', () => {
      dom.sidebar.classList.toggle('mobile-open');
    });
  }

  // ==========================================
  // 4. LIVE CLOCK & GREETING
  // ==========================================
  function updateLiveClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (dom.liveClock) {
      dom.liveClock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    if (dom.liveDate) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      dom.liveDate.textContent = now.toLocaleDateString('tr-TR', options);
    }

    // Dynamic Greeting
    if (dom.greetingTitle) {
      const hr = now.getHours();
      let greeting = 'Merhaba';
      if (hr >= 6 && hr < 12) greeting = 'Günaydın';
      else if (hr >= 12 && hr < 18) greeting = 'İyi Günler';
      else if (hr >= 18 && hr < 23) greeting = 'İyi Akşamlar';
      else greeting = 'İyi Geceler';

      const userName = state.settings.userName || 'Gezgin';
      dom.greetingTitle.textContent = `${greeting}, ${userName} ✨`;
    }
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // ==========================================
  // 5. DASHBOARD VIEW
  // ==========================================
  function renderDashboard() {
    const tasks = window.LuminaStorage.getTasks();
    const notes = window.LuminaStorage.getNotes();
    const habits = window.LuminaStorage.getHabits();
    const stats = window.LuminaStorage.getStats();

    // Stats
    const completedCount = tasks.filter(t => t.completed).length;
    const focusMins = stats.todayFocusMinutes || 0;
    const totalTasks = tasks.length || 1;
    const efficiency = Math.round((completedCount / totalTasks) * 100);

    if (dom.dashStatCompleted) dom.dashStatCompleted.textContent = completedCount;
    if (dom.dashStatFocusTime) dom.dashStatFocusTime.textContent = `${focusMins} dk`;
    if (dom.dashStatNotesCount) dom.dashStatNotesCount.textContent = notes.length;
    if (dom.dashStatEfficiency) dom.dashStatEfficiency.textContent = `%${Math.max(efficiency, 35)}`;

    // Mini Priority Tasks (top 4 uncompleted)
    if (dom.dashMiniTaskList) {
      const priorityTasks = tasks.filter(t => !t.completed).slice(0, 4);
      if (priorityTasks.length === 0) {
        dom.dashMiniTaskList.innerHTML = `
          <div style="text-align: center; color: var(--text-faint); padding: 1.5rem 0;">
            🎉 Harika! Bekleyen öncelikli göreviniz bulunmuyor.
          </div>`;
      } else {
        dom.dashMiniTaskList.innerHTML = priorityTasks.map(task => `
          <div class="mini-task-item" data-id="${task.id}">
            <div class="custom-checkbox" onclick="window.LuminaApp.toggleTask('${task.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span class="task-text">${escapeHtml(task.title)}</span>
            <span class="priority-tag ${task.priority}">${task.priority.toUpperCase()}</span>
          </div>
        `).join('');
      }
    }

    // Mini Habits
    if (dom.dashHabitList) {
      dom.dashHabitList.innerHTML = habits.slice(0, 3).map(h => `
        <div class="habit-mini-row">
          <span class="habit-name">${escapeHtml(h.name)}</span>
          <span class="streak-pill">🔥 ${h.streak} Gün</span>
        </div>
      `).join('');
    }
  }

  // Dashboard AI Quick Chips Click
  if (dom.dashAiPromptStrip) {
    dom.dashAiPromptStrip.querySelectorAll('.ai-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.textContent.trim();
        openCopilotWithPrompt(prompt);
      });
    });
  }

  // ==========================================
  // 6. TASKS VIEW
  // ==========================================
  function renderTasks() {
    const tasks = window.LuminaStorage.getTasks();
    const filter = state.taskFilter;

    let filtered = tasks;
    const todayStr = new Date().toISOString().split('T')[0];

    if (filter === 'today') {
      filtered = tasks.filter(t => t.dueDate === todayStr);
    } else if (filter === 'priority') {
      filtered = tasks.filter(t => t.priority === 'high' || t.priority === 'medium');
    } else if (filter === 'completed') {
      filtered = tasks.filter(t => t.completed);
    }

    if (!dom.taskFullList) return;

    if (filtered.length === 0) {
      dom.taskFullList.innerHTML = `
        <div style="text-align: center; color: var(--text-faint); padding: 3rem 1rem;">
          <svg style="width: 48px; height: 48px; stroke: var(--text-faint); margin-bottom: 0.8rem;" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
          <p>Bu görünümde listelenecek görev bulunamadı.</p>
        </div>`;
      return;
    }

    dom.taskFullList.innerHTML = filtered.map(task => {
      const isChecked = task.completed ? 'checked' : '';
      const isCardCompleted = task.completed ? 'completed' : '';
      const subtasksHtml = task.subtasks && task.subtasks.length > 0 ? `
        <div class="subtasks-container">
          ${task.subtasks.map((st, sIdx) => `
            <div class="subtask-item ${st.done ? 'done' : ''}">
              <div class="custom-checkbox ${st.done ? 'checked' : ''}" style="width:16px; height:16px;" onclick="window.LuminaApp.toggleSubtask('${task.id}', ${sIdx})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>${escapeHtml(st.text)}</span>
            </div>
          `).join('')}
        </div>
      ` : '';

      return `
        <div class="task-card-item ${isCardCompleted}" id="task-card-${task.id}">
          <div class="task-card-main">
            <div class="custom-checkbox ${isChecked}" onclick="window.LuminaApp.toggleTask('${task.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="task-content-block">
              <div class="task-title">${escapeHtml(task.title)}</div>
              ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
              <div class="task-badges-row">
                <span class="task-category-pill">📁 ${escapeHtml(task.category)}</span>
                <span class="priority-tag ${task.priority}">${task.priority.toUpperCase()}</span>
                ${task.dueDate ? `<span class="task-date-pill">📅 ${task.dueDate}</span>` : ''}
              </div>
            </div>
            <div class="task-card-actions">
              <button class="item-action-btn ai-breakdown-btn" title="AI ile Alt Adımlara Böl" onclick="window.LuminaApp.aiBreakdownTask('${task.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </button>
              <button class="item-action-btn delete-btn" title="Görevi Sil" onclick="window.LuminaApp.deleteTask('${task.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
          ${subtasksHtml}
        </div>
      `;
    }).join('');
  }

  // Add Task Event
  if (dom.btnAddTask) {
    dom.btnAddTask.addEventListener('click', handleCreateTask);
  }
  if (dom.taskMainInput) {
    dom.taskMainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCreateTask();
    });
  }

  function handleCreateTask() {
    const title = dom.taskMainInput.value.trim();
    if (!title) {
      showToast('Lütfen görev başlığı girin.', 'error');
      return;
    }

    const newTask = {
      title,
      category: dom.taskCategorySelect.value,
      priority: dom.taskPrioritySelect.value,
      dueDate: dom.taskDueDateInput.value || new Date().toISOString().split('T')[0]
    };

    window.LuminaStorage.addTask(newTask);
    dom.taskMainInput.value = '';
    showToast('Yeni görev eklendi!', 'success');
    renderTasks();
    renderDashboard();
  }

  // Task Filter Tabs
  dom.taskFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.taskFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.taskFilter = tab.getAttribute('data-filter');
      renderTasks();
    });
  });

  // Global LuminaApp exports for inline HTML clicks
  window.LuminaApp = {
    toggleTask(taskId) {
      const task = window.LuminaStorage.toggleTask(taskId);
      if (task && task.completed) {
        window.LuminaAudio.playChime('complete');
        triggerConfetti();
        showToast('Tebrikler! Görev tamamlandı 🎉', 'success');
      }
      renderTasks();
      renderDashboard();
    },

    toggleSubtask(taskId, subtaskIndex) {
      const tasks = window.LuminaStorage.getTasks();
      const task = tasks.find(t => t.id === taskId);
      if (task && task.subtasks && task.subtasks[subtaskIndex]) {
        task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
        window.LuminaStorage.updateTaskSubtasks(taskId, task.subtasks);
        renderTasks();
      }
    },

    deleteTask(taskId) {
      window.LuminaStorage.deleteTask(taskId);
      showToast('Görev silindi.', 'info');
      renderTasks();
      renderDashboard();
    },

    async aiBreakdownTask(taskId) {
      const tasks = window.LuminaStorage.getTasks();
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      showToast('Lumina AI görevi parçalıyor...', 'info');
      const prompt = `Lütfen bu görevi 3 somut, uygulanabilir ve zaman tahminli alt adıma böl:\nGörev: ${task.title}`;
      
      try {
        const result = await window.LuminaAI.generate(prompt);
        const subtasks = window.LuminaAI.parseSubtasksFromText(result);
        
        task.subtasks = subtasks.map(text => ({ text, done: false }));
        window.LuminaStorage.updateTaskSubtasks(taskId, task.subtasks);
        
        showToast('AI eylem adımları göreve eklendi!', 'success');
        renderTasks();
      } catch (err) {
        showToast('AI planlama yapılamadı.', 'error');
      }
    },

    selectNote(noteId) {
      state.activeNoteId = noteId;
      renderNotes();
    }
  };

  // ==========================================
  // 7. NOTES VIEW
  // ==========================================
  function renderNotes() {
    const notes = window.LuminaStorage.getNotes();
    const query = dom.notesSearchInput ? dom.notesSearchInput.value.toLowerCase().trim() : '';

    const filtered = notes.filter(n => 
      n.title.toLowerCase().includes(query) || 
      n.content.toLowerCase().includes(query)
    );

    // If no active note, pick first
    if (!state.activeNoteId && notes.length > 0) {
      state.activeNoteId = notes[0].id;
    }

    // Render left list
    if (dom.notesListScroll) {
      if (filtered.length === 0) {
        dom.notesListScroll.innerHTML = `<div style="color:var(--text-faint); padding:1rem; text-align:center;">Not bulunamadı.</div>`;
      } else {
        dom.notesListScroll.innerHTML = filtered.map(note => {
          const isActive = note.id === state.activeNoteId ? 'active' : '';
          const snippet = note.content.replace(/[#*`\n]/g, ' ').substring(0, 60) || 'Boş not...';
          const dateStr = new Date(note.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
          return `
            <div class="note-item-card ${isActive}" onclick="window.LuminaApp.selectNote('${note.id}')">
              <div class="note-item-title">${escapeHtml(note.title)}</div>
              <div class="note-item-snippet">${escapeHtml(snippet)}</div>
              <div class="note-item-meta">
                <span>📁 ${note.tags ? note.tags[0] : 'Genel'}</span>
                <span>${dateStr}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render active note editor
    const activeNote = notes.find(n => n.id === state.activeNoteId);
    if (activeNote) {
      if (dom.noteTitleInput) dom.noteTitleInput.value = activeNote.title;
      if (dom.noteBodyTextarea) dom.noteBodyTextarea.value = activeNote.content;
      updateNoteWordCount(activeNote.content);
      if (dom.noteLastUpdated) {
        const timeStr = new Date(activeNote.updatedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        dom.noteLastUpdated.textContent = `Son güncelleme: ${timeStr}`;
      }
    }
  }

  function updateNoteWordCount(text = '') {
    if (!dom.noteWordCount) return;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    dom.noteWordCount.textContent = `${words} kelime | ${chars} karakter`;
  }

  // Note Search & Create
  if (dom.notesSearchInput) {
    dom.notesSearchInput.addEventListener('input', renderNotes);
  }

  if (dom.btnNewNote) {
    dom.btnNewNote.addEventListener('click', () => {
      const newNote = window.LuminaStorage.addNote('Başlıksız Not ✍️', '');
      state.activeNoteId = newNote.id;
      showToast('Yeni not oluşturuldu.', 'success');
      renderNotes();
      if (dom.noteTitleInput) dom.noteTitleInput.focus();
    });
  }

  // Note Auto-save debounced
  let noteSaveTimeout = null;
  function scheduleNoteSave() {
    clearTimeout(noteSaveTimeout);
    noteSaveTimeout = setTimeout(() => {
      if (!state.activeNoteId) return;
      const title = dom.noteTitleInput.value.trim() || 'Başlıksız Not';
      const content = dom.noteBodyTextarea.value;
      window.LuminaStorage.updateNote(state.activeNoteId, { title, content });
      updateNoteWordCount(content);
      if (dom.noteLastUpdated) dom.noteLastUpdated.textContent = 'Kaydedildi ✓';
    }, 400);
  }

  if (dom.noteTitleInput) dom.noteTitleInput.addEventListener('input', scheduleNoteSave);
  if (dom.noteBodyTextarea) dom.noteBodyTextarea.addEventListener('input', scheduleNoteSave);

  // Note Delete
  if (dom.btnDeleteNote) {
    dom.btnDeleteNote.addEventListener('click', () => {
      if (!state.activeNoteId) return;
      window.LuminaStorage.deleteNote(state.activeNoteId);
      state.activeNoteId = null;
      showToast('Not silindi.', 'info');
      renderNotes();
    });
  }

  // AI Note Tools
  if (dom.btnNoteSummarize) {
    dom.btnNoteSummarize.addEventListener('click', async () => {
      const content = dom.noteBodyTextarea.value;
      const title = dom.noteTitleInput.value;
      if (!content.trim()) {
        showToast('Özetlenecek not içeriği bulunamadı.', 'error');
        return;
      }
      showToast('Lumina AI notu özetliyor...', 'info');
      const prompt = `Lütfen aşağıdaki notu 3 temel maddede özetle:\nBaşlık: ${title}\nİçerik: ${content}`;
      const summary = await window.LuminaAI.generate(prompt);
      
      dom.noteBodyTextarea.value += `\n\n---\n${summary}`;
      scheduleNoteSave();
      showToast('Özet nota eklendi!', 'success');
    });
  }

  if (dom.btnNoteActionize) {
    dom.btnNoteActionize.addEventListener('click', async () => {
      const content = dom.noteBodyTextarea.value;
      if (!content.trim()) return;
      showToast('Eylem adımları çıkarılıyor...', 'info');
      const prompt = `Aşağıdaki nottan uygulanabilir somut eylem adımları listesi çıkar:\n${content}`;
      const actions = await window.LuminaAI.generate(prompt);
      
      dom.noteBodyTextarea.value += `\n\n---\n${actions}`;
      scheduleNoteSave();
      showToast('Eylem maddeleri eklendi!', 'success');
    });
  }

  if (dom.btnNoteExpand) {
    dom.btnNoteExpand.addEventListener('click', async () => {
      const content = dom.noteBodyTextarea.value;
      if (!content.trim()) return;
      showToast('Lumina AI fikri genişletiyor...', 'info');
      const prompt = `Aşağıdaki düşünce ve notu daha derin ve stratejik bir perspektifle genişlet:\n${content}`;
      const expansion = await window.LuminaAI.generate(prompt);
      
      dom.noteBodyTextarea.value += `\n\n---\n${expansion}`;
      scheduleNoteSave();
      showToast('Genişletilmiş fikirler nota eklendi!', 'success');
    });
  }

  // ==========================================
  // 8. DEEP FOCUS & POMODORO TIMER
  // ==========================================
  const CIRCLE_RADIUS = 115;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  if (dom.timerCircleProgress) {
    dom.timerCircleProgress.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE}`;
    dom.timerCircleProgress.style.strokeDashoffset = `0`;
  }

  function setTimerMode(mode) {
    state.timer.mode = mode;
    state.timer.isRunning = false;
    clearInterval(state.timer.intervalId);

    const pomodoroConfig = state.settings.pomodoro || { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 };
    let minutes = pomodoroConfig.workDuration || 25;
    let label = 'Derin Odak Seansı';

    if (mode === 'shortBreak') {
      minutes = pomodoroConfig.shortBreakDuration || 5;
      label = 'Kısa Mola & Dinlenme';
    } else if (mode === 'longBreak') {
      minutes = pomodoroConfig.longBreakDuration || 15;
      label = 'Uzun Mola';
    }

    state.timer.duration = minutes * 60;
    state.timer.remaining = minutes * 60;

    dom.timerModeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    if (dom.timerStatusText) dom.timerStatusText.textContent = label;
    updateTimerDisplay();
    updatePlayPauseButtonIcon(false);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timer.remaining / 60);
    const secs = state.timer.remaining % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (dom.timerDisplayTime) dom.timerDisplayTime.textContent = timeStr;
    if (dom.zenDisplayTime) dom.zenDisplayTime.textContent = timeStr;

    // Progress circle stroke offset
    if (dom.timerCircleProgress) {
      const progressFraction = (state.timer.duration - state.timer.remaining) / state.timer.duration;
      const offset = CIRCLE_CIRCUMFERENCE * (1 - progressFraction);
      dom.timerCircleProgress.style.strokeDashoffset = offset;
    }
  }

  function toggleTimer() {
    if (state.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    state.timer.isRunning = true;
    updatePlayPauseButtonIcon(true);

    state.timer.intervalId = setInterval(() => {
      if (state.timer.remaining > 0) {
        state.timer.remaining--;
        updateTimerDisplay();
      } else {
        finishTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    state.timer.isRunning = false;
    clearInterval(state.timer.intervalId);
    updatePlayPauseButtonIcon(false);
  }

  function resetTimer() {
    pauseTimer();
    state.timer.remaining = state.timer.duration;
    updateTimerDisplay();
  }

  function finishTimer() {
    pauseTimer();
    window.LuminaAudio.playChime('timerEnd');

    if (state.timer.mode === 'pomodoro') {
      const focusMins = Math.round(state.timer.duration / 60);
      window.LuminaStorage.addFocusMinutes(focusMins);
      triggerConfetti();
      showToast(`Harika! ${focusMins} dakikalık odak seansını tamamladınız 🏆`, 'success');
      setTimerMode('shortBreak');
    } else {
      showToast('Mola tamamlandı, yeniden odaklanmaya hazır mısınız? ⚡', 'info');
      setTimerMode('pomodoro');
    }
    renderDashboard();
  }

  function updatePlayPauseButtonIcon(isRunning) {
    if (!dom.btnToggleTimer) return;
    if (isRunning) {
      dom.btnToggleTimer.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    } else {
      dom.btnToggleTimer.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    }
  }

  dom.timerModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimerMode(btn.getAttribute('data-mode'));
    });
  });

  if (dom.btnToggleTimer) dom.btnToggleTimer.addEventListener('click', toggleTimer);
  if (dom.btnResetTimer) dom.btnResetTimer.addEventListener('click', resetTimer);

  // Zen Mode (Full Screen)
  if (dom.btnZenMode) {
    dom.btnZenMode.addEventListener('click', () => {
      if (dom.zenOverlay) {
        dom.zenOverlay.classList.add('active');
        // Pick top uncompleted task as zen target
        const tasks = window.LuminaStorage.getTasks();
        const activeTask = tasks.find(t => !t.completed);
        if (dom.zenTaskTitle) {
          dom.zenTaskTitle.textContent = activeTask ? `🎯 Odak: ${activeTask.title}` : '🎯 Derin Zihinsel Odak';
        }
      }
    });
  }

  if (dom.zenExitBtn) {
    dom.zenExitBtn.addEventListener('click', () => {
      dom.zenOverlay.classList.remove('active');
    });
  }

  // ==========================================
  // 9. AMBIENT SOUNDS ENGINE
  // ==========================================
  const soundStates = { rain: false, fire: false, wind: false, binaural: false };

  function setupSoundControl(type, toggleBtn, volumeSlider, toggleMethod) {
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      soundStates[type] = !soundStates[type];
      const card = toggleBtn.closest('.sound-card-item');

      if (soundStates[type]) {
        toggleMethod.call(window.LuminaAudio, true, parseFloat(volumeSlider.value));
        toggleBtn.textContent = 'Durdur';
        if (card) card.classList.add('active');
      } else {
        toggleMethod.call(window.LuminaAudio, false);
        toggleBtn.textContent = 'Başlat';
        if (card) card.classList.remove('active');
      }
    });

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        window.LuminaAudio.setVolume(type, val);
      });
    }
  }

  setupSoundControl('rain', dom.soundToggles.rain, dom.soundVolumes.rain, window.LuminaAudio.toggleRain);
  setupSoundControl('fire', dom.soundToggles.fire, dom.soundVolumes.fire, window.LuminaAudio.toggleFire);
  setupSoundControl('wind', dom.soundToggles.wind, dom.soundVolumes.wind, window.LuminaAudio.toggleWind);
  setupSoundControl('binaural', dom.soundToggles.binaural, dom.soundVolumes.binaural, window.LuminaAudio.toggleBinaural);

  // ==========================================
  // 10. HABITS & ANALYTICS VIEW
  // ==========================================
  const DAYS_OF_WEEK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  function renderHabitsAndChart() {
    const habits = window.LuminaStorage.getHabits();
    const stats = window.LuminaStorage.getStats();

    // Render Habit Table
    if (dom.habitTableBody) {
      if (habits.length === 0) {
        dom.habitTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:1.5rem; color:var(--text-faint);">Henüz alışkanlık eklenmedi.</td></tr>`;
      } else {
        dom.habitTableBody.innerHTML = habits.map(h => `
          <tr>
            <td class="habit-title-cell">${escapeHtml(h.name)}</td>
            ${h.days.map((isDone, dIdx) => `
              <td>
                <span class="day-circle ${isDone ? 'done' : ''}" onclick="window.LuminaApp.toggleHabit('${h.id}', ${dIdx})">
                  ${isDone ? '✓' : ''}
                </span>
              </td>
            `).join('')}
            <td>
              <span class="streak-pill">🔥 ${h.streak}</span>
            </td>
          </tr>
        `).join('');
      }
    }

    // Render Weekly Focus Bar Chart
    if (dom.chartBarsGroup) {
      const history = stats.weeklyFocusHistory || [45, 60, 30, 75, 50, 0, 0];
      const maxVal = Math.max(...history, 90);

      dom.chartBarsGroup.innerHTML = history.map((val, idx) => {
        const heightPct = Math.round((val / maxVal) * 100);
        return `
          <div class="chart-bar-group">
            <span style="font-size:0.7rem; color:var(--text-faint);">${val}d</span>
            <div class="chart-bar-track">
              <div class="chart-bar-fill" style="height: ${heightPct}%;"></div>
            </div>
            <span class="chart-day-label">${DAYS_OF_WEEK[idx]}</span>
          </div>
        `;
      }).join('');
    }
  }

  window.LuminaApp.toggleHabit = (habitId, dayIndex) => {
    window.LuminaStorage.toggleHabitDay(habitId, dayIndex);
    renderHabitsAndChart();
    renderDashboard();
  };

  if (dom.btnAddHabit) {
    dom.btnAddHabit.addEventListener('click', () => {
      const name = dom.habitNameInput.value.trim();
      if (!name) return;
      window.LuminaStorage.addHabit(name);
      dom.habitNameInput.value = '';
      showToast('Yeni alışkanlık hedefin eklendi!', 'success');
      renderHabitsAndChart();
      renderDashboard();
    });
  }

  // ==========================================
  // 11. LUMINA AI COPILOT CHAT PANEL
  // ==========================================
  function openCopilot() {
    dom.aiCopilotDrawer.classList.add('open');
    if (dom.copilotInput) dom.copilotInput.focus();
  }

  function closeCopilot() {
    dom.aiCopilotDrawer.classList.remove('open');
  }

  function openCopilotWithPrompt(promptText) {
    openCopilot();
    if (dom.copilotInput) {
      dom.copilotInput.value = promptText;
      handleSendCopilotMessage();
    }
  }

  if (dom.floatingAiTrigger) dom.floatingAiTrigger.addEventListener('click', openCopilot);
  if (dom.topbarAiBtn) dom.topbarAiBtn.addEventListener('click', openCopilot);
  if (dom.closeCopilotBtn) dom.closeCopilotBtn.addEventListener('click', closeCopilot);

  async function handleSendCopilotMessage() {
    const text = dom.copilotInput.value.trim();
    if (!text) return;

    appendChatMessage(text, 'user');
    dom.copilotInput.value = '';

    // Typing placeholder
    const typingId = 'typing-' + Date.now();
    appendChatMessage('Lumina düşünüyor...', 'ai', typingId);

    try {
      // Build context from active tasks & notes
      const tasks = window.LuminaStorage.getTasks();
      const activeTaskCount = tasks.filter(t => !t.completed).length;
      const context = `Kullanıcının ${activeTaskCount} aktif görevi var.`;

      const response = await window.LuminaAI.generate(text, context);
      
      const typingElem = document.getElementById(typingId);
      if (typingElem) {
        typingElem.innerHTML = formatMarkdown(response);
      }
    } catch (err) {
      const typingElem = document.getElementById(typingId);
      if (typingElem) {
        typingElem.textContent = 'Üzgünüm, şu anda yanıt oluşturulamadı.';
      }
    }
  }

  function appendChatMessage(text, role, elementId = null) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    if (elementId) bubble.id = elementId;
    bubble.innerHTML = role === 'ai' ? formatMarkdown(text) : escapeHtml(text);
    dom.copilotMessages.appendChild(bubble);
    dom.copilotMessages.scrollTop = dom.copilotMessages.scrollHeight;
  }

  if (dom.copilotSendBtn) dom.copilotSendBtn.addEventListener('click', handleSendCopilotMessage);
  if (dom.copilotInput) {
    dom.copilotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendCopilotMessage();
    });
  }

  // ==========================================
  // 12. COMMAND PALETTE (CTRL+K)
  // ==========================================
  const COMMANDS = [
    { title: 'Yeni Görev Ekle', icon: '⚡', action: () => { switchView('tasks'); dom.taskMainInput?.focus(); } },
    { title: 'Yeni Not Oluştur', icon: '📝', action: () => { switchView('notes'); dom.btnNewNote?.click(); } },
    { title: 'Pomodoro Başlat / Durdur', icon: '⏱️', action: () => { switchView('focus'); toggleTimer(); } },
    { title: 'Tam Ekran Zen Moduna Geç', icon: '🧘', action: () => { switchView('focus'); dom.btnZenMode?.click(); } },
    { title: 'AI Asistanı Aç', icon: '✨', action: openCopilot },
    { title: 'Koyu / Açık Tema Değiştir', icon: '🌓', action: toggleTheme },
    { title: 'Görevler Sekmesine Git', icon: '📋', action: () => switchView('tasks') },
    { title: 'Notlar Sekmesine Git', icon: '📑', action: () => switchView('notes') },
    { title: 'Derin Odak Sekmesine Git', icon: '🎯', action: () => switchView('focus') },
    { title: 'Alışkanlıklar & İstatistikler', icon: '📊', action: () => switchView('habits') },
    { title: 'Ayarları Aç', icon: '⚙️', action: openSettings }
  ];

  function openCommandPalette() {
    dom.cmdPaletteBackdrop.classList.add('open');
    dom.cmdSearchInput.value = '';
    renderCommandResults('');
    dom.cmdSearchInput.focus();
  }

  function closeCommandPalette() {
    dom.cmdPaletteBackdrop.classList.remove('open');
  }

  function renderCommandResults(query = '') {
    const q = query.toLowerCase().trim();
    const filtered = COMMANDS.filter(c => c.title.toLowerCase().includes(q));

    dom.cmdResultsList.innerHTML = filtered.map((c, idx) => `
      <div class="command-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <span>${c.icon}</span>
        <span>${escapeHtml(c.title)}</span>
      </div>
    `).join('');

    dom.cmdResultsList.querySelectorAll('.command-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-idx'));
        closeCommandPalette();
        filtered[idx].action();
      });
    });
  }

  if (dom.searchCommandBtn) dom.searchCommandBtn.addEventListener('click', openCommandPalette);

  if (dom.cmdSearchInput) {
    dom.cmdSearchInput.addEventListener('input', (e) => {
      renderCommandResults(e.target.value);
    });
    dom.cmdSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const selected = dom.cmdResultsList.querySelector('.command-item.selected');
        if (selected) selected.click();
      }
      if (e.key === 'Escape') closeCommandPalette();
    });
  }

  if (dom.cmdPaletteBackdrop) {
    dom.cmdPaletteBackdrop.addEventListener('click', (e) => {
      if (e.target === dom.cmdPaletteBackdrop) closeCommandPalette();
    });
  }

  // Keyboard Shortcuts (Ctrl+K / Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeCopilot();
      if (dom.zenOverlay) dom.zenOverlay.classList.remove('active');
    }
  });

  // ==========================================
  // 13. SETTINGS & THEME
  // ==========================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.settings.theme = theme;
  }

  function toggleTheme() {
    const newTheme = (state.settings.theme === 'light') ? 'dark' : 'light';
    applyTheme(newTheme);
    window.LuminaStorage.saveSettings(state.settings);
    showToast(`${newTheme === 'dark' ? 'Koyu' : 'Açık'} tema aktif.`, 'info');
  }

  if (dom.themeToggleBtn) dom.themeToggleBtn.addEventListener('click', toggleTheme);

  function openSettings() {
    if (!dom.settingsModal) return;
    dom.settingUserName.value = state.settings.userName || 'Gezgin';
    dom.settingTheme.value = state.settings.theme || 'dark';
    dom.settingGeminiKey.value = state.settings.geminiApiKey || '';
    dom.settingWorkDuration.value = state.settings.pomodoro?.workDuration || 25;
    dom.settingsModal.showModal();
  }

  if (dom.settingsBtn) dom.settingsBtn.addEventListener('click', openSettings);
  if (dom.closeSettingsBtn) dom.closeSettingsBtn.addEventListener('click', () => dom.settingsModal.close());

  if (dom.btnSaveSettings) {
    dom.btnSaveSettings.addEventListener('click', () => {
      state.settings.userName = dom.settingUserName.value.trim() || 'Gezgin';
      state.settings.theme = dom.settingTheme.value;
      state.settings.geminiApiKey = dom.settingGeminiKey.value.trim();
      if (!state.settings.pomodoro) state.settings.pomodoro = {};
      state.settings.pomodoro.workDuration = parseInt(dom.settingWorkDuration.value) || 25;

      applyTheme(state.settings.theme);
      window.LuminaStorage.saveSettings(state.settings);
      dom.settingsModal.close();
      updateLiveClock();
      showToast('Ayarlar kaydedildi.', 'success');
    });
  }

  // Backup & Restore
  if (dom.btnExportData) {
    dom.btnExportData.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.LuminaStorage.exportBackup());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `lumina_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Yedek JSON dosyası indirildi.', 'success');
    });
  }

  if (dom.btnImportData) {
    dom.btnImportData.addEventListener('click', () => dom.importFileInput.click());
  }

  if (dom.importFileInput) {
    dom.importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = window.LuminaStorage.importBackup(event.target.result);
        if (success) {
          showToast('Veriler başarıyla geri yüklendi!', 'success');
          dom.settingsModal.close();
          renderDashboard();
          renderTasks();
          renderNotes();
          renderHabitsAndChart();
        } else {
          showToast('Geçersiz yedek dosyası.', 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  // Quick Action Topbar Button (New Task)
  if (dom.quickNewTaskBtn) {
    dom.quickNewTaskBtn.addEventListener('click', () => {
      switchView('tasks');
      dom.taskMainInput.focus();
    });
  }

  // ==========================================
  // 14. TOAST NOTIFICATIONS & CONFETTI
  // ==========================================
  function showToast(message, type = 'info') {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `<span style="font-weight:700;">${icon}</span> <span>${escapeHtml(message)}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Canvas Confetti
  function triggerConfetti() {
    const canvas = dom.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#a855f7'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.vRot;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // ==========================================
  // 15. UTILITIES (Sanitization & Markdown)
  // ==========================================
  function escapeHtml(text = '') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatMarkdown(text = '') {
    let html = escapeHtml(text);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet lists
    html = html.replace(/^[•*-]\s+(.+)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Line breaks
    html = html.replace(/\n/g, '<br/>');
    return html;
  }

  // ==========================================
  // 16. PWA DIRECT INSTALL PROMPT
  // ==========================================
  let deferredPrompt = null;
  const pwaBanner = document.getElementById('pwa-install-banner');
  const pwaBtn = document.getElementById('pwa-install-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner) pwaBanner.style.display = 'flex';
  });

  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (pwaBanner) pwaBanner.style.display = 'none';
          showToast('Uygulama başarıyla kuruluyor! 🎉', 'success');
        }
        deferredPrompt = null;
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (pwaBanner) pwaBanner.style.display = 'none';
    showToast('Lumina AI telefonunuza kuruldu!', 'success');
  });

  // ==========================================
  // 12. SANCTUM (ZİHİN MABEDİ) CONTROLLER
  // ==========================================
  let sanctumInitialized = false;
  let activeBinauralPreset = { carrier: 200, beat: 10 };
  let isBrownNoiseActive = false;
  let isBinauralActive = false;

  function initSanctumView() {
    if (window.LuminaSanctum) {
      setTimeout(() => {
        window.LuminaSanctum.initVoid('sanctum-void-canvas');
      }, 50);
    }

    renderMementoMori();
    renderCouncil();
    renderDilemmas();
    renderDreamHistory();
    updateDopamineFastDisplay();

    if (sanctumInitialized) return;
    sanctumInitialized = true;
    setupSanctumEventListeners();
  }

  function setupSanctumEventListeners() {
    // Tab switching
    const chamberTabs = document.querySelectorAll('.sanctum-chamber-tabs .chamber-tab');
    const chamberPanels = document.querySelectorAll('.sanctum-panels-container .chamber-panel');

    chamberTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetChamber = tab.getAttribute('data-chamber');
        chamberTabs.forEach(t => t.classList.toggle('active', t === tab));
        chamberPanels.forEach(p => p.classList.toggle('active', p.id === `chamber-panel-${targetChamber}`));

        if (targetChamber === 'void' && window.LuminaSanctum) {
          setTimeout(() => window.LuminaSanctum.initVoid('sanctum-void-canvas'), 50);
        }
      });
    });

    // 1. Void
    const voidBtn = document.getElementById('sanctum-void-shred-btn');
    const voidInput = document.getElementById('sanctum-void-input');
    const voidCounter = document.getElementById('sanctum-void-counter');

    function updateVoidCounter() {
      if (voidCounter) {
        const count = JSON.parse(localStorage.getItem('lumina_void_count') || '0');
        voidCounter.textContent = `Yok Edilen Yük: ${count}`;
      }
    }
    updateVoidCounter();

    if (voidBtn && voidInput) {
      voidBtn.addEventListener('click', () => {
        const text = voidInput.value.trim();
        if (!text) {
          showToast('Lütfen boşluğa fırlatılacak bir düşünce yazın.', 'warning');
          return;
        }
        window.LuminaSanctum.feedVoidWithText(text);
        voidInput.value = '';
        updateVoidCounter();
        showToast('Zihinsel yük yerçekimsel tekillikte parçalandı 🌌', 'success');
      });
    }

    // 2. Alter-Ego
    const egoBtn = document.getElementById('sanctum-alterego-send-btn');
    const egoInput = document.getElementById('sanctum-alterego-input');
    const egoHistory = document.getElementById('sanctum-alterego-output');

    if (egoBtn && egoInput && egoHistory) {
      const handleEgoSubmit = () => {
        const text = egoInput.value.trim();
        if (!text) return;

        const userBubble = document.createElement('div');
        userBubble.className = 'alterego-bubble user';
        userBubble.textContent = text;
        egoHistory.appendChild(userBubble);
        egoInput.value = '';
        egoHistory.scrollTop = egoHistory.scrollHeight;

        setTimeout(() => {
          const resp = window.LuminaSanctum.generateAlterEgoResponse(text);
          const egoBubble = document.createElement('div');
          egoBubble.className = 'alterego-bubble ego';
          egoBubble.innerHTML = resp.replace(/\n/g, '<br>');
          egoHistory.appendChild(egoBubble);
          egoHistory.scrollTop = egoHistory.scrollHeight;
        }, 400);
      };

      egoBtn.addEventListener('click', handleEgoSubmit);
      egoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleEgoSubmit();
      });
    }

    // 3. Multiverse
    const multiBtn = document.getElementById('sanctum-multiverse-btn');
    const choiceAInput = document.getElementById('sanctum-choice-a');
    const choiceBInput = document.getElementById('sanctum-choice-b');
    const multiOutput = document.getElementById('sanctum-multiverse-output');

    if (multiBtn && choiceAInput && choiceBInput && multiOutput) {
      multiBtn.addEventListener('click', () => {
        const a = choiceAInput.value.trim();
        const b = choiceBInput.value.trim();
        const res = window.LuminaSanctum.simulateMultiverse(a, b);

        multiOutput.style.display = 'grid';
        multiOutput.innerHTML = `
          <div class="multiverse-card branch-a">
            <h4 style="color:#f59e0b; margin-bottom:0.75rem; font-weight:700;">${res.universeA.title}</h4>
            <div class="multiverse-year-step">${res.universeA.year1}</div>
            <div class="multiverse-year-step">${res.universeA.year5}</div>
            <div class="multiverse-year-step">${res.universeA.year10}</div>
          </div>
          <div class="multiverse-card branch-b">
            <h4 style="color:#06b6d4; margin-bottom:0.75rem; font-weight:700;">${res.universeB.title}</h4>
            <div class="multiverse-year-step">${res.universeB.year1}</div>
            <div class="multiverse-year-step">${res.universeB.year5}</div>
            <div class="multiverse-year-step">${res.universeB.year10}</div>
          </div>
        `;
        showToast('Paralel zaman çizgileri hesaplandı 🌌', 'info');
      });
    }

    // 4. Council
    const councilAskBtn = document.getElementById('sanctum-council-ask-btn');
    const councilInput = document.getElementById('sanctum-council-input');

    if (councilAskBtn && councilInput) {
      councilAskBtn.addEventListener('click', () => {
        const q = councilInput.value.trim();
        renderCouncil(q);
        showToast('Kadim Konsey kararını bildirdi 🏛️', 'info');
      });
    }

    // 5. Memento Mori
    const mementoCalcBtn = document.getElementById('sanctum-memento-calc-btn');
    if (mementoCalcBtn) {
      mementoCalcBtn.addEventListener('click', renderMementoMori);
    }

    // 6. Vagus Breathing
    const breathToggleBtn = document.getElementById('sanctum-breath-toggle-btn');
    const breathOrb = document.getElementById('sanctum-breath-orb');
    const breathText = document.getElementById('sanctum-breath-text');
    let currentBreathMode = 'box';

    document.querySelectorAll('.breath-mode-selector .mode-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.breath-mode-selector .mode-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentBreathMode = pill.getAttribute('data-bmode') || 'box';
        if (window.LuminaSanctum.isBreathingActive) {
          window.LuminaSanctum.stopBreathing();
          window.LuminaSanctum.startBreathing(breathOrb, breathText, currentBreathMode);
        }
      });
    });

    if (breathToggleBtn && breathOrb && breathText) {
      breathToggleBtn.addEventListener('click', () => {
        if (window.LuminaSanctum.isBreathingActive) {
          window.LuminaSanctum.stopBreathing();
          breathToggleBtn.innerHTML = '<span>Nefes Seansını Başlat (432Hz)</span>';
          breathText.textContent = 'Nefes Seansı Tamamlandı 🙏';
          breathOrb.style.transform = 'scale(1.0)';
        } else {
          window.LuminaSanctum.startBreathing(breathOrb, breathText, currentBreathMode);
          breathToggleBtn.innerHTML = '<span>Seansı Durdur</span>';
        }
      });
    }

    // 7. Shadow
    const shadowBtn = document.getElementById('sanctum-shadow-btn');
    const shadowInput = document.getElementById('sanctum-shadow-input');
    const shadowOutput = document.getElementById('sanctum-shadow-output');

    if (shadowBtn && shadowInput && shadowOutput) {
      shadowBtn.addEventListener('click', () => {
        const text = shadowInput.value.trim();
        if (!text) {
          showToast('Lütfen duygunuzu veya krizinizi ifade edin.', 'warning');
          return;
        }
        const res = window.LuminaSanctum.analyzeArchetype(text);
        shadowOutput.style.display = 'block';
        shadowOutput.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.75rem;">
            <span style="font-size:1.8rem;">${res.icon}</span>
            <div>
              <h4 style="font-size:1.1rem; font-weight:800; color:#c084fc;">${res.name}</h4>
              <span style="font-size:0.8rem; color:#f43f5e; font-weight:600;">Gölge Enerjisi: ${res.energy}</span>
            </div>
          </div>
          <div style="margin-bottom:0.75rem; font-size:0.9rem; color:var(--text-main);">
            <strong>Bilinçaltı Teşhisi:</strong> ${res.diagnosis}
          </div>
          <div style="background:rgba(168, 85, 247, 0.15); border-left:3px solid #a855f7; padding:0.65rem 0.85rem; border-radius:4px; font-size:0.88rem; color:#e9d5ff;">
            <strong>🛡️ Bilişsel Panzehir:</strong> ${res.antidote}
          </div>
        `;
        showToast('Gölge arketipi çözümlendi 🔮', 'success');
      });
    }

    // 8. CBT
    const cbtBtn = document.getElementById('sanctum-cbt-btn');
    const cbtInput = document.getElementById('sanctum-cbt-input');
    const cbtOutput = document.getElementById('sanctum-cbt-output');

    if (cbtBtn && cbtInput && cbtOutput) {
      cbtBtn.addEventListener('click', () => {
        const text = cbtInput.value.trim();
        if (!text) {
          showToast('Lütfen olumsuz düşünceyi yazın.', 'warning');
          return;
        }
        const res = window.LuminaSanctum.reframeCognitiveDistortion(text);
        cbtOutput.style.display = 'block';
        cbtOutput.innerHTML = `
          <div style="font-weight:700; color:#f43f5e; margin-bottom:0.5rem;">${res.distortionIdentified}</div>
          <div style="background:rgba(255, 255, 255, 0.03); padding:0.75rem; border-radius:6px; margin-bottom:0.75rem; font-size:0.88rem; white-space:pre-line;">${res.rationalReframing}</div>
          <div style="font-weight:700; color:#10b981; font-size:0.92rem;">${res.affirmation}</div>
        `;
        showToast('Bilişsel panzehir üretildi 🛡️', 'success');
      });
    }

    // 9. Dream Lab
    const dreamBtn = document.getElementById('sanctum-dream-btn');
    const dreamInput = document.getElementById('sanctum-dream-input');
    const dreamOutput = document.getElementById('sanctum-dream-output');

    if (dreamBtn && dreamInput && dreamOutput) {
      dreamBtn.addEventListener('click', () => {
        const text = dreamInput.value.trim();
        if (!text) {
          showToast('Lütfen rüyanızı anlatın.', 'warning');
          return;
        }
        const res = window.LuminaSanctum.analyzeDream(text);
        dreamOutput.style.display = 'block';
        dreamOutput.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-size:1rem; font-weight:800; color:#38bdf8;">🌙 Bilinçaltı Sembol Çözümü</h4>
            <span style="font-size:0.8rem; font-weight:600; color:#10b981;">Berraklık: %${res.lucidity}</span>
          </div>
          <div style="margin-bottom:0.75rem;">
            ${res.symbols.map(s => `
              <div style="margin-bottom:0.4rem; font-size:0.88rem;">
                <strong style="color:#f472b6;">🔹 ${s.symbol}:</strong> ${s.archetype} — <span style="color:var(--text-muted);">${s.interpretation}</span>
              </div>
            `).join('')}
          </div>
          <div style="padding:0.65rem; background:rgba(6, 182, 212, 0.15); border-radius:6px; font-size:0.88rem; color:#e0f2fe;">
            <strong>✨ Uyanık Hayata Mesaj:</strong> ${res.coreMessage}
          </div>
        `;
        dreamInput.value = '';
        renderDreamHistory();
        showToast('Rüya analiz edildi ve günlüğe kaydedildi 🌙', 'success');
      });
    }

    // 10. Dopamine Fasting
    const fastStartBtn = document.getElementById('sanctum-fast-start-btn');
    const urgeBtn = document.getElementById('sanctum-urge-btn');
    const urgeCountdown = document.getElementById('sanctum-urge-countdown');
    const brownBtn = document.getElementById('sanctum-brown-btn');

    let selectedFastHours = 2;
    document.querySelectorAll('.fast-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.fast-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedFastHours = parseInt(pill.getAttribute('data-fast-hours') || '2');
      });
    });

    if (fastStartBtn) {
      fastStartBtn.addEventListener('click', () => {
        window.LuminaSanctum.startDopamineFast(selectedFastHours);
        updateDopamineFastDisplay();
        showToast(`${selectedFastHours} saatlik dopamin orucu başlatıldı ⚡`, 'success');
      });
    }

    if (urgeBtn && urgeCountdown) {
      urgeBtn.addEventListener('click', () => {
        urgeCountdown.style.display = 'block';
        urgeBtn.disabled = true;
        window.LuminaSanctum.startUrgeSurfing(
          (secs) => {
            urgeCountdown.textContent = `Dürtü Dalgası Sönüyor: ${secs} sn (Derin nefes al)`;
          },
          () => {
            urgeCountdown.textContent = '🎉 Dalga Atlatıldı! Prefrontal korteks kontrolü geri aldı.';
            urgeBtn.disabled = false;
            setTimeout(() => { urgeCountdown.style.display = 'none'; }, 4000);
          }
        );
      });
    }

    if (brownBtn) {
      brownBtn.addEventListener('click', () => {
        isBrownNoiseActive = !isBrownNoiseActive;
        window.LuminaSanctum.toggleBrownNoise(isBrownNoiseActive);
        brownBtn.textContent = isBrownNoiseActive ? 'Brown Noise Durdur' : 'Brown Noise Başlat';
        if (isBrownNoiseActive) brownBtn.classList.add('btn-primary');
        else brownBtn.classList.remove('btn-primary');
      });
    }

    // 12. Neuro-Waves
    const binauralPlayBtn = document.getElementById('sanctum-binaural-play-btn');
    const binauralStopBtn = document.getElementById('sanctum-binaural-stop-btn');
    const binauralStatus = document.getElementById('sanctum-binaural-status');

    document.querySelectorAll('#sanctum-wave-presets .wave-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sanctum-wave-presets .wave-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const carrier = parseFloat(btn.getAttribute('data-carrier') || '200');
        const beat = parseFloat(btn.getAttribute('data-beat') || '10');
        activeBinauralPreset = { carrier, beat };

        if (isBinauralActive) {
          window.LuminaSanctum.playBinauralBeat(carrier, beat, 0.15);
          if (binauralStatus) binauralStatus.textContent = `Frekans Aktif: ${beat} Hz Binaural Dalga`;
        }
      });
    });

    if (binauralPlayBtn) {
      binauralPlayBtn.addEventListener('click', () => {
        isBinauralActive = true;
        window.LuminaSanctum.playBinauralBeat(activeBinauralPreset.carrier, activeBinauralPreset.beat, 0.15);
        if (binauralStatus) binauralStatus.textContent = `Frekans Aktif: ${activeBinauralPreset.beat} Hz Binaural Dalga (Kulaklık)`;
        showToast(`${activeBinauralPreset.beat}Hz Nöro-Dalga başlatıldı 🧠`, 'success');
      });
    }

    if (binauralStopBtn) {
      binauralStopBtn.addEventListener('click', () => {
        isBinauralActive = false;
        window.LuminaSanctum.stopBinauralBeat();
        if (binauralStatus) binauralStatus.textContent = 'Frekans: Kapalı';
        showToast('Nöro-Dalga durduruldu', 'info');
      });
    }
  }

  // Helper renderers
  function renderCouncil(query) {
    const councilCards = document.getElementById('sanctum-council-cards');
    if (!councilCards || !window.LuminaSanctum) return;
    const philosophers = window.LuminaSanctum.consultCouncil(query || '');
    councilCards.innerHTML = philosophers.map(p => `
      <div class="philosopher-card">
        <div class="philosopher-header">
          <div>
            <div class="phil-name">${p.name}</div>
            <div class="phil-school">${p.school}</div>
          </div>
          <span class="phil-badge">${p.badge}</span>
        </div>
        <div class="phil-quote">${p.quote}</div>
        <div class="phil-verdict"><strong>Hüküm:</strong> ${p.verdict}</div>
      </div>
    `).join('');
  }

  function renderMementoMori() {
    const mementoStats = document.getElementById('sanctum-memento-stats');
    const mementoGrid = document.getElementById('sanctum-memento-grid');
    const mementoAgeInput = document.getElementById('sanctum-memento-age');
    if (!mementoStats || !mementoGrid || !window.LuminaSanctum) return;

    const age = parseInt(mementoAgeInput ? mementoAgeInput.value : '23') || 23;
    const data = window.LuminaSanctum.calculateMementoMori(age);

    mementoStats.innerHTML = `
      <div class="memento-stat-box">
        <div class="memento-stat-num">${data.livedWeeks}</div>
        <div class="memento-stat-lbl">Yaşanan Hafta</div>
      </div>
      <div class="memento-stat-box">
        <div class="memento-stat-num">${data.remainingWeeks}</div>
        <div class="memento-stat-lbl">Kalan Hafta</div>
      </div>
      <div class="memento-stat-box">
        <div class="memento-stat-num">%${data.livedPct}</div>
        <div class="memento-stat-lbl">Geçen Ömür Payı</div>
      </div>
    `;

    const totalDots = 4160;
    const livedCount = Math.min(totalDots, data.livedWeeks);
    let dotsHtml = '';
    for (let i = 0; i < totalDots; i++) {
      const isLived = i < livedCount;
      dotsHtml += `<div class="week-dot ${isLived ? 'lived' : 'remaining'}"></div>`;
    }
    mementoGrid.innerHTML = dotsHtml;
  }

  function renderDreamHistory() {
    const dreamHistory = document.getElementById('sanctum-dream-history');
    if (!dreamHistory || !window.LuminaSanctum) return;
    const list = window.LuminaSanctum.getSavedDreams();
    if (list.length === 0) {
      dreamHistory.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Henüz kayıtlı rüya bulunmuyor.</div>';
      return;
    }
    dreamHistory.innerHTML = list.map(d => `
      <div style="padding:0.75rem; background:rgba(255,255,255,0.03); border-radius:6px; margin-bottom:0.5rem; border-left:3px solid #06b6d4;">
        <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--secondary); margin-bottom:0.25rem;">
          <span>${d.date}</span>
          <span>Berraklık: %${d.lucidity}</span>
        </div>
        <div style="font-size:0.88rem; color:var(--text-main); margin-bottom:0.4rem;">${d.text.substring(0, 120)}${d.text.length > 120 ? '...' : ''}</div>
        <div style="font-size:0.82rem; color:#a78bfa;"><strong>Mesaj:</strong> ${d.coreMessage}</div>
      </div>
    `).join('');
  }

  function updateDopamineFastDisplay() {
    const fastTimerDisplay = document.getElementById('sanctum-fast-timer-display');
    const fastProgressBar = document.getElementById('sanctum-fast-progress-bar');
    const fastStatusLabel = document.getElementById('sanctum-fast-status-label');
    if (!fastTimerDisplay || !fastProgressBar || !window.LuminaSanctum) return;

    const state = window.LuminaSanctum.getFastState();
    if (!state || !state.active) {
      fastTimerDisplay.textContent = '02:00:00';
      fastProgressBar.style.width = '0%';
      if (fastStatusLabel) fastStatusLabel.textContent = 'Oruç Beklemede — Başlamak için butona basın';
      return;
    }
    const h = String(state.hoursLeft).padStart(2, '0');
    const m = String(state.minutesLeft).padStart(2, '0');
    const s = String(state.secondsLeft).padStart(2, '0');
    fastTimerDisplay.textContent = `${h}:${m}:${s}`;
    fastProgressBar.style.width = `${state.progressPct}%`;
    if (fastStatusLabel) fastStatusLabel.textContent = `Prefrontal Korteks Yenileniyor — %${state.progressPct} tamamlandı`;
  }
  setInterval(updateDopamineFastDisplay, 1000);

  function renderDilemmas() {
    const dilemmasList = document.getElementById('sanctum-dilemmas-list');
    const dnaOutput = document.getElementById('sanctum-dna-output');
    if (!dilemmasList || !dnaOutput || !window.LuminaSanctum) return;

    const dilemmas = window.LuminaSanctum.getDilemmas();
    const choices = JSON.parse(localStorage.getItem('lumina_dilemma_choices') || '{}');

    dilemmasList.innerHTML = dilemmas.map(d => {
      const userChoice = choices[d.id];
      return `
        <div class="dilemma-card">
          <h4 style="font-weight:700; color:var(--text-main); font-size:1rem;">${d.title}</h4>
          <div class="dilemma-scenario">${d.scenario}</div>
          <div class="dilemma-options-grid">
            <button class="btn-dilemma-opt ${userChoice === 'A' ? 'chosen' : ''}" data-did="${d.id}" data-opt="A">
              <strong>A:</strong> ${d.optionA.text}
              <div style="font-size:0.75rem; color:var(--secondary); margin-top:0.35rem;">(${d.optionA.label})</div>
            </button>
            <button class="btn-dilemma-opt ${userChoice === 'B' ? 'chosen' : ''}" data-did="${d.id}" data-opt="B">
              <strong>B:</strong> ${d.optionB.text}
              <div style="font-size:0.75rem; color:var(--secondary); margin-top:0.35rem;">(${d.optionB.label})</div>
            </button>
          </div>
        </div>
      `;
    }).join('');

    dilemmasList.querySelectorAll('.btn-dilemma-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const did = btn.getAttribute('data-did');
        const opt = btn.getAttribute('data-opt');
        window.LuminaSanctum.recordDilemmaChoice(did, opt);
        renderDilemmas();
      });
    });

    const dna = window.LuminaSanctum.calculatePhilosophicalDNA();
    dnaOutput.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
        <h4 style="font-size:1.1rem; font-weight:800; color:#a855f7;">🧬 Felsefi Karakter DNA'nız</h4>
        <span style="font-size:0.8rem; color:var(--text-muted);">${dna.answered} / 4 İkilem Yanıtlandı</span>
      </div>
      <div style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">${dna.dominantSchool}</div>
      <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">${dna.description}</p>
    `;
  }

  // --- Initial Render ---
  renderDashboard();
});
