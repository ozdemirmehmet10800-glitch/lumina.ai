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
    // Map legacy views to 5 Master Spaces
    if (viewName === 'focus') {
      viewName = 'sanctum';
      setTimeout(() => activateSanctumChamber('focus'), 50);
    } else if (viewName === 'chronos') {
      viewName = 'sanctum';
      setTimeout(() => activateSanctumChamber('memento'), 50);
    } else if (viewName === 'habits' || viewName === 'codex' || viewName === 'life-os') {
      viewName = 'biohack';
    } else if (viewName === 'galaxy' || viewName === 'synthesizer' || viewName === 'twin' || viewName === 'trajectory') {
      viewName = 'notes';
    }

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

    // Refresh view-specific content safely
    try {
      if (viewName === 'dashboard') renderDashboard();
      if (viewName === 'tasks') renderTasks();
      if (viewName === 'notes') renderNotes();
      if (viewName === 'sanctum') initSanctumView();
      if (viewName === 'biohack') {
        if (typeof initBiohackView === 'function') initBiohackView();
        renderHabitsAndChart();
      }
    } catch (err) {
      console.warn('View render exception:', err);
    }
  }

  function activateSanctumChamber(chamberName) {
    const chamberTabs = document.querySelectorAll('.sanctum-chamber-tabs .chamber-tab');
    const chamberPanels = document.querySelectorAll('.sanctum-panels-container .chamber-panel');
    chamberTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-chamber') === chamberName));
    chamberPanels.forEach(p => p.classList.toggle('active', p.id === `chamber-panel-${chamberName}`));
    if (chamberName === 'void' && window.LuminaSanctum) {
      setTimeout(() => {
        window.LuminaSanctum.resizeCanvas();
        window.LuminaSanctum.initVoid('sanctum-void-canvas');
      }, 50);
    }
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
        if (window.LuminaRPG) {
          window.LuminaRPG.addXP(30, 'willpower', 'Görev Tamamlandı');
        }
        showToast('Tebrikler! Görev tamamlandı (+30 XP) 🎉', 'success');
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

    syncSanctumTimerDisplay();
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
      if (window.LuminaRPG) {
        window.LuminaRPG.addXP(50, 'intellect', 'Odak Seansı');
      }
      showToast(`Harika! ${focusMins} dakikalık odak seansını tamamladınız (+50 XP) 🏆`, 'success');
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
    const updated = window.LuminaStorage.toggleHabitDay(habitId, dayIndex);
    if (updated && updated.days && updated.days[dayIndex] && window.LuminaRPG) {
      window.LuminaRPG.addXP(20, 'vitality', 'Alışkanlık Zinciri');
    }
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
  // 16. PWA DIRECT INSTALL & DOWNLOAD MODAL
  // ==========================================
  let deferredPrompt = null;
  const pwaBanner = document.getElementById('pwa-install-banner');
  const pwaBtn = document.getElementById('pwa-install-btn');
  const downloadModal = document.getElementById('download-install-modal');
  const sidebarDownloadBtn = document.getElementById('sidebar-download-btn');
  const topbarDownloadBtn = document.getElementById('topbar-download-btn');
  const closeDownloadModal = document.getElementById('close-download-modal');
  const modalPwaTrigger = document.getElementById('btn-modal-pwa-trigger');
  const pwaStatusMsg = document.getElementById('pwa-status-msg');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner) pwaBanner.style.display = 'flex';
  });

  const openDownloadModalHandler = () => {
    if (downloadModal) {
      if (pwaStatusMsg) pwaStatusMsg.style.display = 'none';
      downloadModal.showModal();
    }
  };

  if (sidebarDownloadBtn) sidebarDownloadBtn.addEventListener('click', openDownloadModalHandler);
  if (topbarDownloadBtn) topbarDownloadBtn.addEventListener('click', openDownloadModalHandler);
  if (closeDownloadModal && downloadModal) {
    closeDownloadModal.addEventListener('click', () => downloadModal.close());
  }

  const triggerDirectInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (pwaBanner) pwaBanner.style.display = 'none';
        if (downloadModal) downloadModal.close();
        showToast('Uygulama başarıyla kuruluyor! 🎉', 'success');
      }
      deferredPrompt = null;
    } else {
      if (pwaStatusMsg) {
        pwaStatusMsg.style.display = 'block';
        pwaStatusMsg.innerHTML = '💡 <strong>Bilgi:</strong> Tarayıcınızın adres çubuğundaki (URL yanındaki) <strong>📥 İndir</strong> butonuna tıklayarak doğrudan masaüstünüze yükleyebilirsiniz. (Zaten yüklüyse uygulama olarak açabilirsiniz)';
      }
    }
  };

  if (pwaBtn) pwaBtn.addEventListener('click', triggerDirectInstall);
  if (modalPwaTrigger) modalPwaTrigger.addEventListener('click', triggerDirectInstall);

  window.addEventListener('appinstalled', () => {
    if (pwaBanner) pwaBanner.style.display = 'none';
    if (downloadModal) downloadModal.close();
    showToast('Lumina AI başarıyla cihazınıza kuruldu!', 'success');
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

    renderSanctumMementoMori();
    updateVoidCounterDisplay();

    if (sanctumInitialized) return;
    sanctumInitialized = true;
    setupSanctumEventListeners();
  }

  function updateVoidCounterDisplay() {
    const count = localStorage.getItem('lumina_void_count') || '0';
    const c1 = document.getElementById('sanctum-void-counter');
    const c2 = document.getElementById('sanctum-hero-void-counter');
    if (c1) c1.textContent = `Yok Edilen Yük: ${count}`;
    if (c2) c2.textContent = `Yok Edilen Yük: ${count}`;
  }

  function renderSanctumMementoMori(userAge) {
    const grid = document.getElementById('memento-interactive-grid');
    const ageInput = document.getElementById('memento-user-age');
    const livedBadge = document.getElementById('memento-lived-badge');
    const remainingBadge = document.getElementById('memento-remaining-badge');
    if (!grid || !window.LuminaSanctum) return;

    const age = userAge || (ageInput ? parseInt(ageInput.value, 10) : 25) || 25;
    const data = window.LuminaSanctum.calculateMementoMori(age);

    if (livedBadge) livedBadge.textContent = `Yaşanan: ${data.livedWeeks.toLocaleString('tr-TR')} Hafta (%${data.livedPct})`;
    if (remainingBadge) remainingBadge.textContent = `Kalan: ${data.remainingWeeks.toLocaleString('tr-TR')} Hafta (%${data.remainingPct})`;

    // 4,160 dots fragment
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < data.totalWeeks; i++) {
      const dot = document.createElement('div');
      dot.className = `memento-dot ${i < data.livedWeeks ? 'lived' : 'remaining'}`;
      dot.title = `Hafta ${i + 1} (${Math.floor(i / 52)}. Yaş)`;
      fragment.appendChild(dot);
    }
    grid.innerHTML = '';
    grid.appendChild(fragment);
  }

  function syncSanctumTimerDisplay() {
    const timeDisplay = document.getElementById('timer-display-time-sanctum');
    const statusText = document.getElementById('timer-status-text-sanctum');
    const circleProgress = document.getElementById('timer-circle-progress-sanctum');

    const mins = Math.floor(state.timer.remaining / 60);
    const secs = state.timer.remaining % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (timeDisplay) timeDisplay.textContent = timeStr;
    if (statusText) {
      statusText.textContent = state.timer.isRunning ? 'Odak Seansı Devam Ediyor...' : 'Derin Nöro-Akış Seansı';
    }

    if (circleProgress) {
      const progressFraction = (state.timer.duration - state.timer.remaining) / state.timer.duration;
      const radius = 115;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference * (1 - progressFraction);
      circleProgress.style.strokeDashoffset = offset;
    }
  }

  function setupSanctumEventListeners() {
    // 1. Tab switching
    const chamberTabs = document.querySelectorAll('.sanctum-chamber-tabs .chamber-tab');
    const chamberPanels = document.querySelectorAll('.sanctum-panels-container .chamber-panel');

    chamberTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetChamber = tab.getAttribute('data-chamber');
        chamberTabs.forEach(t => t.classList.toggle('active', t === tab));
        chamberPanels.forEach(p => p.classList.toggle('active', p.id === `chamber-panel-${targetChamber}`));

        if (targetChamber === 'void' && window.LuminaSanctum) {
          setTimeout(() => {
            window.LuminaSanctum.resizeCanvas();
            window.LuminaSanctum.initVoid('sanctum-void-canvas');
          }, 50);
        } else if (targetChamber === 'memento') {
          renderSanctumMementoMori();
        }
      });
    });

    // 2. Void Purge Shredder
    const voidBtn = document.getElementById('sanctum-void-shred-btn');
    const voidInput = document.getElementById('sanctum-void-input');

    if (voidBtn && voidInput) {
      const handlePurge = () => {
        const text = voidInput.value.trim();
        if (!text) {
          showToast('Lütfen tekilliğe fırlatılacak bir yük veya kaygı yazın.', 'warning');
          return;
        }
        window.LuminaSanctum.feedVoidWithText(text);
        voidInput.value = '';
        updateVoidCounterDisplay();
        showToast('Zihinsel yük yerçekimsel tekillikte parçalandı 🌌 (+25 XP)', 'success');
      };

      voidBtn.addEventListener('click', handlePurge);
      voidInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePurge();
      });
    }

    // 3. Ambient Synthesizer Sliders
    const tracks = ['rain', 'waves', 'forest', 'binaural'];
    tracks.forEach(track => {
      const slider = document.getElementById(`ambient-vol-${track}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          window.LuminaSanctum.setAmbientTrackVolume(track, val);
        });
      }
    });

    const stopAmbientBtn = document.getElementById('btn-stop-all-ambient');
    if (stopAmbientBtn) {
      stopAmbientBtn.addEventListener('click', () => {
        window.LuminaSanctum.stopAllAmbient();
        tracks.forEach(track => {
          const slider = document.getElementById(`ambient-vol-${track}`);
          if (slider) slider.value = 0;
        });
        showToast('Tüm sentetik sesler susturuldu 🔇', 'info');
      });
    }

    // 4. Sanctum Pomodoro Controls
    const sanctumToggleBtn = document.getElementById('btn-toggle-timer-sanctum');
    const sanctumResetBtn = document.getElementById('btn-reset-timer-sanctum');
    const sanctumModeBtns = document.querySelectorAll('#chamber-panel-focus .mode-btn');

    if (sanctumToggleBtn) {
      sanctumToggleBtn.addEventListener('click', () => {
        toggleTimer();
        syncSanctumTimerDisplay();
      });
    }
    if (sanctumResetBtn) {
      sanctumResetBtn.addEventListener('click', () => {
        resetTimer();
        syncSanctumTimerDisplay();
      });
    }
    sanctumModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sanctumModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        setTimerMode(mode);
        syncSanctumTimerDisplay();
      });
    });

    // 5. Memento Mori Recalculate
    const recalcBtn = document.getElementById('btn-recalc-memento');
    const ageInput = document.getElementById('memento-user-age');
    if (recalcBtn && ageInput) {
      recalcBtn.addEventListener('click', () => {
        renderSanctumMementoMori(parseInt(ageInput.value, 10));
        showToast('Yaşam kum saati güncellendi ⏳', 'info');
      });
      ageInput.addEventListener('change', () => {
        renderSanctumMementoMori(parseInt(ageInput.value, 10));
      });
    }

    // 6. Alter-Ego Chat
    const egoBtn = document.getElementById('sanctum-alterego-send-btn');
    const egoInput = document.getElementById('sanctum-alterego-input');
    const egoHistory = document.getElementById('sanctum-alterego-output');

    if (egoBtn && egoInput && egoHistory) {
      const handleEgoSubmit = () => {
        const text = egoInput.value.trim();
        if (!text) return;

        const userBubble = document.createElement('div');
        userBubble.style.padding = '0.5rem 0.75rem';
        userBubble.style.background = 'rgba(56, 189, 248, 0.15)';
        userBubble.style.borderRadius = '8px';
        userBubble.style.marginBottom = '0.5rem';
        userBubble.style.color = '#38bdf8';
        userBubble.textContent = `Sen: "${text}"`;
        egoHistory.appendChild(userBubble);
        egoInput.value = '';
        egoHistory.scrollTop = egoHistory.scrollHeight;

        setTimeout(() => {
          const resp = window.LuminaSanctum.generateAlterEgoResponse(text);
          const egoBubble = document.createElement('div');
          egoBubble.style.padding = '0.65rem 0.85rem';
          egoBubble.style.background = 'rgba(168, 85, 247, 0.15)';
          egoBubble.style.borderLeft = '3px solid #a855f7';
          egoBubble.style.borderRadius = '8px';
          egoBubble.style.marginBottom = '0.5rem';
          egoBubble.style.color = '#f1f5f9';
          egoBubble.innerHTML = resp;
          egoHistory.appendChild(egoBubble);
          egoHistory.scrollTop = egoHistory.scrollHeight;
        }, 300);
      };

      egoBtn.addEventListener('click', handleEgoSubmit);
      egoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleEgoSubmit();
      });
    }

    // 7. Multiverse Simulator
    const multiBtn = document.getElementById('sanctum-multiverse-btn');
    const choiceA = document.getElementById('sanctum-choice-a');
    const choiceB = document.getElementById('sanctum-choice-b');
    const multiOutput = document.getElementById('sanctum-multiverse-output');

    if (multiBtn && choiceA && choiceB && multiOutput) {
      multiBtn.addEventListener('click', () => {
        const a = choiceA.value.trim() || 'Konfor alanında kalmak';
        const b = choiceB.value.trim() || 'Cesur hamleyi yapmak';
        const res = window.LuminaSanctum.simulateMultiverse(a, b);

        multiOutput.style.display = 'block';
        multiOutput.innerHTML = `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:1rem;">
              <h4 style="color:#ef4444; font-weight:700; margin-bottom:0.5rem;">${res.universeA.title}</h4>
              <p style="font-size:0.8rem; margin-bottom:0.35rem; color:#cbd5e1;">${res.universeA.year1}</p>
              <p style="font-size:0.8rem; margin-bottom:0.35rem; color:#cbd5e1;">${res.universeA.year5}</p>
              <p style="font-size:0.8rem; color:#94a3b8;">${res.universeA.year10}</p>
            </div>
            <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:1rem;">
              <h4 style="color:#10b981; font-weight:700; margin-bottom:0.5rem;">${res.universeB.title}</h4>
              <p style="font-size:0.8rem; margin-bottom:0.35rem; color:#cbd5e1;">${res.universeB.year1}</p>
              <p style="font-size:0.8rem; margin-bottom:0.35rem; color:#cbd5e1;">${res.universeB.year5}</p>
              <p style="font-size:0.8rem; color:#94a3b8;">${res.universeB.year10}</p>
            </div>
          </div>
        `;
        showToast('Kozmik çoklu evren projeksiyonu hesaplandı 🌌', 'info');
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

  // ==========================================
  // RPG SYSTEM RENDERER & TOPBAR
  // ==========================================
  function updateTopbarRPG() {
    if (!window.LuminaRPG) return;
    const prog = window.LuminaRPG.getLevelProgress();
    const lvlTag = document.getElementById('rpg-topbar-level');
    const titleTag = document.getElementById('rpg-topbar-title');
    const xpFill = document.getElementById('rpg-topbar-xp-fill');
    if (lvlTag) lvlTag.textContent = `LVL ${prog.level}`;
    if (titleTag) titleTag.textContent = prog.title;
    if (xpFill) xpFill.style.width = `${prog.progressPct}%`;
  }

  function renderRPGView() {
    if (!window.LuminaRPG) return;
    const prog = window.LuminaRPG.getLevelProgress();
    const lvlNum = document.getElementById('rpg-level-num');
    const titleBadge = document.getElementById('rpg-title-badge');
    const xpText = document.getElementById('rpg-xp-text');
    const xpFill = document.getElementById('rpg-xp-fill');
    const statW = document.getElementById('stat-bar-willpower');
    const statI = document.getElementById('stat-bar-intellect');
    const statM = document.getElementById('stat-bar-mindfulness');
    const statV = document.getElementById('stat-bar-vitality');

    if (lvlNum) lvlNum.textContent = prog.level;
    if (titleBadge) titleBadge.textContent = prog.title;
    if (xpText) xpText.textContent = `${prog.currentProgress} / ${prog.needed} XP (%${prog.progressPct})`;
    if (xpFill) xpFill.style.width = `${prog.progressPct}%`;

    const attrs = prog.attributes || {};
    if (statW && statW.parentElement && statW.parentElement.previousElementSibling) {
      statW.style.width = `${Math.min(100, (attrs.willpower || 10) * 2)}%`;
      const valEl = statW.parentElement.previousElementSibling.lastElementChild;
      if (valEl) valEl.textContent = `${attrs.willpower} Puan`;
    }
    if (statI && statI.parentElement && statI.parentElement.previousElementSibling) {
      statI.style.width = `${Math.min(100, (attrs.intellect || 10) * 2)}%`;
      const valEl = statI.parentElement.previousElementSibling.lastElementChild;
      if (valEl) valEl.textContent = `${attrs.intellect} Puan`;
    }
    if (statM && statM.parentElement && statM.parentElement.previousElementSibling) {
      statM.style.width = `${Math.min(100, (attrs.mindfulness || 10) * 2)}%`;
      const valEl = statM.parentElement.previousElementSibling.lastElementChild;
      if (valEl) valEl.textContent = `${attrs.mindfulness} Puan`;
    }
    if (statV && statV.parentElement && statV.parentElement.previousElementSibling) {
      statV.style.width = `${Math.min(100, (attrs.vitality || 10) * 2)}%`;
      const valEl = statV.parentElement.previousElementSibling.lastElementChild;
      if (valEl) valEl.textContent = `${attrs.vitality} Puan`;
    }
  }

  window.addEventListener('lumina:xp-gained', (e) => {
    updateTopbarRPG();
    renderRPGView();
    const d = e.detail;
    if (d.leveledUp) {
      window.LuminaAudio.playChime('complete');
      triggerConfetti();
      showToast(`🎉 TEBRİKLER! LEVEL ATLADINIZ: ${d.level} - ${d.title} 👑`, 'success');
    } else {
      showToast(`+${d.amount} XP (${d.stat}): ${d.reason || 'Karakter Gelişimi'} ⚡`, 'info');
    }
  });

  // ==========================================
  // CIRCADIAN RHYTHM RENDERER
  // ==========================================
  function renderCircadian(chronotype = 'bear') {
    if (!window.LuminaSanctum) return;
    const curve = window.LuminaSanctum.getCircadianCurve(chronotype);
    const peak = document.getElementById('circadian-energy-peak');
    const focus = document.getElementById('circadian-focus-window');
    const sleep = document.getElementById('circadian-sleep-drive');
    if (peak) peak.textContent = curve.peak;
    if (focus) focus.textContent = curve.focusWindow;
    if (sleep) sleep.textContent = curve.melatoninStart;
  }

  // ==========================================
  // DICHOTOMY OF CONTROL RENDERER
  // ==========================================
  function renderDichotomy() {
    const listInt = document.getElementById('dichotomy-internal-list');
    const listExt = document.getElementById('dichotomy-external-list');
    if (!listInt || !listExt) return;
    const items = JSON.parse(localStorage.getItem('lumina_dichotomy_items') || '{"internal":["Kendi tepkilerim ve nezaketim", "Bugün ne kadar odaklanacağım", "Beslenmem ve uykum"], "external":["Başkalarının benim hakkımdaki fikirleri", "Trafik ve hava durumu", "Ekonomik belirsizlikler"]}');
    
    listInt.innerHTML = items.internal.length ? items.internal.map(i => `<li>${i}</li>`).join('') : '<li style="color:var(--text-muted);">Henüz içsel kontrol maddesi eklenmedi.</li>';
    listExt.innerHTML = items.external.length ? items.external.map(i => `<li>${i}</li>`).join('') : '<li style="color:#10b981;">Tüm dışsal kaygılar serbest bırakıldı ve buharlaştırıldı! 🌿</li>';
  }

  // ==========================================
  // TIME CAPSULES RENDERER
  // ==========================================
  function renderCapsules() {
    const list = document.getElementById('sanctum-capsules-list');
    if (!list || !window.LuminaSanctum) return;
    const capsules = window.LuminaSanctum.getSealedCapsules();
    if (capsules.length === 0) {
      list.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Henüz mühürlenmiş bir zaman kapsülünüz yok.</div>';
      return;
    }
    list.innerHTML = capsules.map(c => `
      <div class="capsule-sealed-card">
        <div class="capsule-seal-icon">${c.isUnlocked ? '🔓' : '🔒'}</div>
        <h4 style="font-weight:700; color:var(--text-main); font-size:0.95rem; margin-bottom:0.35rem;">${c.title}</h4>
        <div class="capsule-days-tag">${c.isUnlocked ? 'Mühür Açıldı!' : `${c.daysLeft} gün sonra açılacak`}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem;">Mühür Tarihi: ${c.sealDate}</div>
        ${c.isUnlocked ? `<div style="margin-top:0.75rem; padding:0.5rem; background:rgba(255,255,255,0.05); border-radius:4px; font-size:0.85rem; font-style:italic;">"${c.letter}"</div>` : ''}
      </div>
    `).join('');
  }

  // ==========================================
  // COSMIC PERSPECTIVE RENDERER
  // ==========================================
  function renderCosmic() {
    const slider = document.getElementById('cosmic-zoom-slider');
    if (!slider || !window.LuminaSanctum) return;
    const data = window.LuminaSanctum.getCosmicPerspective(parseInt(slider.value, 10) || 0);
    const vis = document.getElementById('cosmic-visual');
    const tit = document.getElementById('cosmic-title');
    const sca = document.getElementById('cosmic-scale');
    const quo = document.getElementById('cosmic-quote');
    if (vis) vis.textContent = data.visual;
    if (tit) tit.textContent = data.title;
    if (sca) sca.textContent = `Ölçek: ${data.scale}`;
    if (quo) quo.textContent = data.quote;
  }

  // ==========================================
  // STOIC AUDIT RENDERER
  // ==========================================
  function renderStoicAudit() {
    const hist = document.getElementById('stoic-audit-history');
    if (!hist) return;
    const audits = JSON.parse(localStorage.getItem('lumina_evening_audits') || '[]');
    if (audits.length === 0) {
      hist.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Henüz kaydedilmiş akşam muhasebesi bulunmuyor.</div>';
      return;
    }
    hist.innerHTML = `
      <h5 style="color:#c084fc; font-weight:700; margin-bottom:0.75rem;">📜 Geçmiş Seneca Muhasebeleri:</h5>
      ${audits.map(a => `
        <div style="padding:0.85rem; background:rgba(255,255,255,0.03); border-left:3px solid #a855f7; border-radius:6px; margin-bottom:0.6rem;">
          <div style="font-size:0.75rem; color:var(--secondary); font-weight:700; margin-bottom:0.35rem;">${a.date}</div>
          <div style="font-size:0.85rem; color:var(--text-main); margin-bottom:0.25rem;"><strong>1. Direnilen:</strong> ${a.q1}</div>
          <div style="font-size:0.85rem; color:var(--text-main); margin-bottom:0.25rem;"><strong>2. Özeleştiri:</strong> ${a.q2}</div>
          <div style="font-size:0.85rem; color:var(--text-main);"><strong>3. Karakter Katkısı:</strong> ${a.q3}</div>
        </div>
      `).join('')}
    `;
  }

  // ==========================================
  // JUNGIAN QUESTIONS RENDERER
  // ==========================================
  function renderJungQuestions() {
    const container = document.getElementById('jung-questions-container');
    if (!container || !window.LuminaSanctum) return;
    const questions = window.LuminaSanctum.getArchetypeQuestions();
    container.innerHTML = questions.map(q => `
      <div class="jung-q-card" data-arch="${q.arch}">
        <div class="jung-q-text">${q.id}. ${q.text}</div>
        <div class="jung-options">
          <button type="button" class="jung-opt-btn" data-val="1">Katılmıyorum</button>
          <button type="button" class="jung-opt-btn" data-val="2">Az</button>
          <button type="button" class="jung-opt-btn active" data-val="3">Kısmen</button>
          <button type="button" class="jung-opt-btn" data-val="4">Çoğunlukla</button>
          <button type="button" class="jung-opt-btn" data-val="5">Tamamen</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.jung-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.jung-options');
        parent.querySelectorAll('.jung-opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // ==========================================
  // KAIZEN RENDERER
  // ==========================================
  function renderKaizenView() {
    const grid = document.getElementById('kaizen-micro-habits-grid');
    const status = document.getElementById('kaizen-pledge-status');
    if (!grid || !window.LuminaSanctum) return;
    const metrics = window.LuminaSanctum.calculateKaizenMetrics(1, 365);
    grid.innerHTML = metrics.microHabits.map(m => `
      <div class="kaizen-micro-item">
        <div style="font-size:0.8rem; font-weight:700; color:#10b981; margin-bottom:0.25rem;">${m.category}</div>
        <div style="font-size:0.92rem; font-weight:700; color:var(--text-main); margin-bottom:0.35rem;">${m.task}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${m.impact}</div>
      </div>
    `).join('');

    const pledged = localStorage.getItem('lumina_kaizen_pledged');
    if (status && pledged === new Date().toDateString()) {
      status.textContent = '✅ Bugünün taahhüdü verildi! İlerleme kaydedildi.';
    }
  }

  // =========================================================================
  // DIMENSION 1: 🌌 CANLI ZİHİN SİNİR AĞI & İKİNCİ BEYİN GALAKSİSİ (GALAXY)
  // =========================================================================
  let galaxyCanvas = null;
  let galaxyCtx = null;
  let galaxyAnimId = null;
  let galaxyNodes = [];
  let galaxyLinks = [];
  let galaxyFilter = 'all';
  let hoveredNode = null;
  let draggedNode = null;
  let isDraggingGalaxy = false;
  let galaxyStars = [];

  function initGalaxyView() {
    galaxyCanvas = document.getElementById('galaxy-canvas');
    if (!galaxyCanvas) return;
    galaxyCtx = galaxyCanvas.getContext('2d');

    // Resize canvas to its container
    resizeGalaxyCanvas();
    window.removeEventListener('resize', resizeGalaxyCanvas);
    window.addEventListener('resize', resizeGalaxyCanvas);

    // Build neural dataset from tasks, notes, habits and sanctum
    buildGalaxyNetwork();

    // Start physics simulation loop
    if (galaxyAnimId) cancelAnimationFrame(galaxyAnimId);
    galaxyLoop();
  }

  function resizeGalaxyCanvas() {
    if (!galaxyCanvas) return;
    const rect = galaxyCanvas.parentElement.getBoundingClientRect();
    galaxyCanvas.width = rect.width;
    galaxyCanvas.height = rect.height || 600;

    // Create background stars
    galaxyStars = [];
    for (let i = 0; i < 70; i++) {
      galaxyStars.push({
        x: Math.random() * galaxyCanvas.width,
        y: Math.random() * galaxyCanvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.2 + 0.05
      });
    }
  }

  function buildGalaxyNetwork() {
    const tasks = window.LuminaStorage.getTasks() || [];
    const notes = window.LuminaStorage.getNotes() || [];
    const habits = window.LuminaStorage.getHabits() || [];
    const width = galaxyCanvas ? galaxyCanvas.width : 800;
    const height = galaxyCanvas ? galaxyCanvas.height : 600;
    const cx = width / 2;
    const cy = height / 2;

    galaxyNodes = [];
    galaxyLinks = [];

    // Core central anchor
    const coreNode = {
      id: 'core-brain',
      label: '🧠 Zihinsel Çekirdek',
      type: 'core',
      color: '#38bdf8',
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      radius: 22,
      fixed: true,
      snippet: 'Tüm düşünce, görev ve alışkanlıkların birleştiği bilinç merkezi.',
      date: 'Canlı Biliş'
    };
    galaxyNodes.push(coreNode);

    // 1. Task Nodes (blue/cyan)
    tasks.slice(0, 15).forEach((t, i) => {
      const angle = (i / Math.max(tasks.length, 1)) * Math.PI * 2;
      const dist = 120 + Math.random() * 80;
      galaxyNodes.push({
        id: `task-${t.id}`,
        label: t.title,
        type: 'task',
        color: '#06b6d4',
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: t.priority === 'high' ? 14 : 11,
        snippet: t.notes || (t.completed ? 'Tamamlanmış Görev' : 'Aktif Odak Görevi'),
        date: t.dueDate ? `Bitiş: ${t.dueDate}` : 'Genel Görev',
        priority: t.priority
      });
    });

    // 2. Note Nodes (emerald)
    notes.slice(0, 12).forEach((n, i) => {
      const angle = ((i + 0.5) / Math.max(notes.length, 1)) * Math.PI * 2;
      const dist = 180 + Math.random() * 90;
      galaxyNodes.push({
        id: `note-${n.id}`,
        label: n.title || 'Başlıksız Not',
        type: 'note',
        color: '#10b981',
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 12,
        snippet: (n.body || '').substring(0, 100) + '...',
        date: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString('tr-TR') : 'Not'
      });
    });

    // 3. Habit Nodes (amber/gold)
    habits.slice(0, 8).forEach((h, i) => {
      const angle = ((i + 0.25) / Math.max(habits.length, 1)) * Math.PI * 2;
      const dist = 150 + Math.random() * 70;
      galaxyNodes.push({
        id: `habit-${h.id}`,
        label: h.title,
        type: 'habit',
        color: '#f59e0b',
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 13,
        snippet: `Seri: ${h.streak || 0} gün • Hedef: ${h.frequency || 'Günlük'}`,
        date: 'Rutin Alışkanlık'
      });
    });

    // 4. Sanctum Pillars (purple)
    const sanctumPillars = [
      { id: 's-stoic', label: 'Stoacı Duruş 🏛️', snippet: 'Kontrol alanı ve dilsiz kabul bilinci' },
      { id: 's-chrono', label: 'Sirkadiyen Ritim ⏳', snippet: 'Biyolojik saat ve optimal odak saatleri' },
      { id: 's-dopamine', label: 'Dopamin Orucu ⚡', snippet: 'Haz resetleme ve yüksek bilişsel berraklık' },
      { id: 's-oracle', label: 'Delphi Kahini 🃏', snippet: 'Bilinçaltı ve felsefi ayna' }
    ];
    sanctumPillars.forEach((s, i) => {
      const angle = (i / sanctumPillars.length) * Math.PI * 2 + 0.7;
      const dist = 220 + Math.random() * 50;
      galaxyNodes.push({
        id: s.id,
        label: s.label,
        type: 'sanctum',
        color: '#c084fc',
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 15,
        snippet: s.snippet,
        date: 'Felsefi Sütun'
      });
    });

    // Generate Synapses (Edges)
    galaxyNodes.forEach(n => {
      if (n.id !== 'core-brain') {
        // Connect each to core
        galaxyLinks.push({ source: 'core-brain', target: n.id, strength: 0.05, spark: Math.random() });

        // Connect nearby or related nodes
        galaxyNodes.forEach(m => {
          if (m.id !== n.id && m.id !== 'core-brain' && Math.random() < 0.12) {
            galaxyLinks.push({ source: n.id, target: m.id, strength: 0.02, spark: Math.random() });
          }
        });
      }
    });

    // Update stats bar
    const statNodes = document.getElementById('galaxy-stat-nodes');
    const statSynapses = document.getElementById('galaxy-stat-synapses');
    if (statNodes) statNodes.textContent = `${galaxyNodes.length} Bilgi Düğümü`;
    if (statSynapses) statSynapses.textContent = `${galaxyLinks.length} Canlı Sinaps`;
  }

  function galaxyLoop() {
    if (state.currentView !== 'galaxy') return;
    if (!galaxyCanvas || !galaxyCtx) return;

    const width = galaxyCanvas.width;
    const height = galaxyCanvas.height;
    const cx = width / 2;
    const cy = height / 2;

    galaxyCtx.clearRect(0, 0, width, height);

    // 1. Draw Starfield
    galaxyCtx.save();
    galaxyStars.forEach(s => {
      s.y -= s.speed;
      if (s.y < 0) s.y = height;
      galaxyCtx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      galaxyCtx.beginPath();
      galaxyCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      galaxyCtx.fill();
    });
    galaxyCtx.restore();

    // 2. Physics step (repulsion, centering & spring forces)
    galaxyNodes.forEach(n => {
      if (n.fixed) {
        n.x = cx;
        n.y = cy;
        return;
      }

      // Gravitational pull to center
      const dx = cx - n.x;
      const dy = cy - n.y;
      n.vx += dx * 0.0006;
      n.vy += dy * 0.0006;

      // Node repulsion
      galaxyNodes.forEach(m => {
        if (m.id === n.id) return;
        const rx = n.x - m.x;
        const ry = n.y - m.y;
        const dist = Math.sqrt(rx * rx + ry * ry) || 1;
        const minDist = n.radius + m.radius + 35;
        if (dist < minDist) {
          const force = (minDist - dist) / dist * 0.08;
          n.vx += rx * force;
          n.vy += ry * force;
        }
      });

      // Damping
      n.vx *= 0.92;
      n.vy *= 0.92;

      // Apply velocity if not dragged
      if (n !== draggedNode) {
        n.x += n.vx;
        n.y += n.vy;
      }

      // Bounds constraint
      n.x = Math.max(n.radius + 10, Math.min(width - n.radius - 10, n.x));
      n.y = Math.max(n.radius + 10, Math.min(height - n.radius - 10, n.y));
    });

    // 3. Draw Synaptic Links
    galaxyLinks.forEach(link => {
      const sourceNode = galaxyNodes.find(n => n.id === link.source);
      const targetNode = galaxyNodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return;

      const isFiltered = (galaxyFilter !== 'all' && sourceNode.type !== galaxyFilter && targetNode.type !== galaxyFilter && sourceNode.type !== 'core');
      const isHovered = hoveredNode && (hoveredNode.id === sourceNode.id || hoveredNode.id === targetNode.id);

      galaxyCtx.save();
      galaxyCtx.beginPath();
      galaxyCtx.moveTo(sourceNode.x, sourceNode.y);
      galaxyCtx.lineTo(targetNode.x, targetNode.y);

      if (isHovered) {
        galaxyCtx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        galaxyCtx.lineWidth = 2.5;
        galaxyCtx.shadowColor = '#38bdf8';
        galaxyCtx.shadowBlur = 10;
      } else if (isFiltered) {
        galaxyCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        galaxyCtx.lineWidth = 0.5;
      } else {
        galaxyCtx.strokeStyle = 'rgba(99, 102, 241, 0.22)';
        galaxyCtx.lineWidth = 1;
      }
      galaxyCtx.stroke();
      galaxyCtx.restore();

      // Traveling action potential spark
      link.spark = (link.spark + 0.008) % 1;
      if (!isFiltered) {
        const sx = sourceNode.x + (targetNode.x - sourceNode.x) * link.spark;
        const sy = sourceNode.y + (targetNode.y - sourceNode.y) * link.spark;
        galaxyCtx.fillStyle = isHovered ? '#38bdf8' : 'rgba(168, 85, 247, 0.7)';
        galaxyCtx.beginPath();
        galaxyCtx.arc(sx, sy, isHovered ? 2.5 : 1.5, 0, Math.PI * 2);
        galaxyCtx.fill();
      }
    });

    // 4. Draw Nodes
    galaxyNodes.forEach(node => {
      const isFiltered = (galaxyFilter !== 'all' && node.type !== galaxyFilter && node.type !== 'core');
      const isHovered = (hoveredNode && hoveredNode.id === node.id);

      galaxyCtx.save();
      galaxyCtx.globalAlpha = isFiltered ? 0.18 : 1.0;

      // Glow halo
      galaxyCtx.shadowColor = node.color;
      galaxyCtx.shadowBlur = isHovered ? 24 : 12;

      // Node Body Circle
      galaxyCtx.fillStyle = node.color;
      galaxyCtx.beginPath();
      galaxyCtx.arc(node.x, node.y, node.radius * (isHovered ? 1.3 : 1.0), 0, Math.PI * 2);
      galaxyCtx.fill();

      // Inner Dark core
      galaxyCtx.fillStyle = '#0f172a';
      galaxyCtx.beginPath();
      galaxyCtx.arc(node.x, node.y, (node.radius * (isHovered ? 1.3 : 1.0)) * 0.65, 0, Math.PI * 2);
      galaxyCtx.fill();

      // Center bright pip
      galaxyCtx.fillStyle = node.color;
      galaxyCtx.beginPath();
      galaxyCtx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      galaxyCtx.fill();

      // Label
      galaxyCtx.shadowBlur = 0;
      galaxyCtx.fillStyle = isHovered ? '#ffffff' : 'rgba(241, 245, 249, 0.85)';
      galaxyCtx.font = `${isHovered ? 'bold 12px' : '10px'} Inter, sans-serif`;
      galaxyCtx.textAlign = 'center';
      galaxyCtx.fillText(node.label.length > 18 ? node.label.substring(0, 16) + '..' : node.label, node.x, node.y + node.radius + 14);

      galaxyCtx.restore();
    });

    galaxyAnimId = requestAnimationFrame(galaxyLoop);
  }

  function initGalaxyEvents() {
    const canvas = document.getElementById('galaxy-canvas');
    const hud = document.getElementById('galaxy-hud-card');
    const resetBtn = document.getElementById('btn-reset-galaxy-view');
    const filterPills = document.querySelectorAll('.galaxy-filter-pill');

    if (!canvas) return;

    // Mouse Move & Hover
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (draggedNode) {
        draggedNode.x = mx;
        draggedNode.y = my;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
        return;
      }

      // Detect hover
      let found = null;
      for (let i = galaxyNodes.length - 1; i >= 0; i--) {
        const n = galaxyNodes[i];
        const dist = Math.hypot(n.x - mx, n.y - my);
        if (dist <= n.radius + 8) {
          found = n;
          break;
        }
      }

      hoveredNode = found;
      if (found && hud) {
        hud.style.display = 'block';
        const typeLabels = { core: 'Bilişsel Çekirdek', task: 'Görev', note: 'AI Notu', habit: 'Alışkanlık', sanctum: 'Zihin Mabedi' };
        document.getElementById('hud-node-type').textContent = typeLabels[found.type] || 'Düğüm';
        document.getElementById('hud-node-date').textContent = found.date || '';
        document.getElementById('hud-node-title').textContent = found.label;
        document.getElementById('hud-node-snippet').textContent = found.snippet || 'Detay bulunmuyor.';
        const conns = galaxyLinks.filter(l => l.source === found.id || l.target === found.id).length;
        document.getElementById('hud-node-connections').textContent = `🔗 ${conns} Canlı Sinirsel Bağlantı`;
      } else if (hud) {
        hud.style.display = 'none';
      }
    });

    // Drag start
    canvas.addEventListener('mousedown', (e) => {
      if (hoveredNode) {
        draggedNode = hoveredNode;
        isDraggingGalaxy = true;
      }
    });

    // Drag end
    window.addEventListener('mouseup', () => {
      draggedNode = null;
      isDraggingGalaxy = false;
    });

    // Filter pills
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        galaxyFilter = pill.getAttribute('data-filter') || 'all';
      });
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        buildGalaxyNetwork();
        window.LuminaAudio.playBeep(440, 'sine', 0.1);
      });
    }
  }

  // =========================================================================
  // DIMENSION 2: 👁️ DİJİTAL ZİHİN İKİZİ (ALTER-SELF)
  // =========================================================================
  function initTwinView() {
    // Populate profile from RPG state and archetype
    const rpg = window.LuminaSanctum ? window.LuminaSanctum.getRPGState() : { level: 1, title: 'Uyanış Yolcusu' };
    const arch = localStorage.getItem('lumina_jungian_result') || 'Kahraman / Mimar';
    const chrono = localStorage.getItem('lumina_chronotype') || 'Ayı (Standart Odak)';

    const levelTag = document.getElementById('twin-level-tag');
    const archTag = document.getElementById('twin-archetype');
    const chronoTag = document.getElementById('twin-chrono');

    if (levelTag) levelTag.textContent = `${rpg.title} (LVL ${rpg.level})`;
    if (archTag) archTag.textContent = arch;
    if (chronoTag) chronoTag.textContent = chrono;
  }

  function initTwinEvents() {
    const sendBtn = document.getElementById('btn-twin-send');
    const input = document.getElementById('twin-user-input');
    const history = document.getElementById('twin-chat-history');
    const chips = document.querySelectorAll('.twin-chip');

    async function handleTwinAsk(promptText) {
      const q = promptText || (input ? input.value.trim() : '');
      if (!q) return;

      if (input) input.value = '';

      // Append user bubble
      appendTwinMessage('user', q);

      // Scroll to bottom
      if (history) history.scrollTop = history.scrollHeight;

      // Thinking placeholder
      const thinkingBubble = appendTwinMessage('ai', '<em>Zihin İkizin senin felsefi pusulana danışıyor... 👁️</em>');

      try {
        const apiKey = state.settings.geminiApiKey;
        let responseText = '';

        if (apiKey && window.LuminaAI && window.LuminaAI.askGemini) {
          const systemContext = "Sen kullanıcının 'Dijital Zihin İkizi'sin (Alter-Self). Kullanıcının hedeflerine, Stoacı erdemlerine ve potansiyeline dürüst bir aynasın. Samimi, derin, net ve yapmacık olmayan bir tonda konuş. Kendi kendini kandırmasına izin verme, doğrudan çözüme odakla.";
          responseText = await window.LuminaAI.askGemini(`${systemContext}\n\nKullanıcı Sorusı: ${q}`);
        } else {
          // Heuristic Built-In Wisdom Engine
          responseText = generateTwinLocalWisdom(q);
        }

        if (thinkingBubble) {
          thinkingBubble.innerHTML = responseText;
        }

        window.LuminaAudio.playBeep(480, 'triangle', 0.12);
      } catch (err) {
        if (thinkingBubble) {
          thinkingBubble.innerHTML = generateTwinLocalWisdom(q);
        }
      }

      if (history) history.scrollTop = history.scrollHeight;
    }

    function appendTwinMessage(sender, htmlContent) {
      if (!history) return null;
      const msgDiv = document.createElement('div');
      msgDiv.className = `twin-message ${sender}`;
      msgDiv.innerHTML = `
        <div class="msg-avatar">${sender === 'ai' ? '👁️' : '👤'}</div>
        <div class="msg-bubble">${htmlContent}</div>
      `;
      history.appendChild(msgDiv);
      return msgDiv.querySelector('.msg-bubble');
    }

    function generateTwinLocalWisdom(prompt) {
      const lower = prompt.toLowerCase();
      if (lower.includes('yalan') || lower.includes('erte')) {
        return "Kendine en büyük yalanın 'yarın daha fazla motivasyonum olacak' demek. Motivasyon eylemin sebebi değil, sonucudur. Şimdi yapabileceğin en küçük 2 dakikalık adıma odaklan ve hemen başla.";
      }
      if (lower.includes('kork') || lower.includes('ego')) {
        return "Korktuğun şey fiziksel bir ölüm tehlikesi değil; başkalarının önünde başarısız görünme korkusu, yani egonun kırılganlığı. Stoacı felsefede ne denir hatırla: Kontrol edemeyeceğin görüşleri bırak, sadece kendi emeğine odaklan.";
      }
      if (lower.includes('80 yaş') || lower.includes('gelecek')) {
        return "80 yaşındaki sen buraya gelseydi, sana ne kadar para kazandığını değil, hangi potansiyeli korkudan dolayı heba ettiğini sorardı. Hata yapmak bir kayıp değildir; hiç denememek en büyük pişmanlıktır.";
      }
      if (lower.includes('karakter') || lower.includes('değer')) {
        return "Temel değerin bilgelik ve disiplindir. Şu an canının istemediği o zor işi yapmak, tam olarak karakterini inşa ettiğin andır. Ruhun kolay yolu değil, seni onurlandıracak doğru yolu seçmeni bekliyor.";
      }
      return `Zihnindeki bu soruyu inceledim: <strong>"${prompt}"</strong>. İkizin olarak sana şunu hatırlatayım: Gerçek güç dış koşullarda değil, senin bu duruma vereceğin tepkide saklıdır. Şimdi sakinleş, durumu kontrol edebileceğin parçalara ayır ve ilk eylemini belirle.`;
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => handleTwinAsk());
    }
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleTwinAsk();
      });
    }
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-q');
        if (q) handleTwinAsk(q);
      });
    });
  }

  // =========================================================================
  // DIMENSION 3: 🔮 GELECEK AĞACI & PARALEL YAŞAM SİMÜLATÖRÜ (TRAJECTORY)
  // =========================================================================
  const defaultTrajectories = [
    {
      id: 'traj-startup',
      name: '🚀 Girişim & Derin İnovasyon',
      color: '#38bdf8',
      desc: 'Yüksek risk, mutlak otonomi ve inovatif bir ürün inşa etme yolu.',
      nodes: [
        { year: '1. Yıl (2027)', focus: 'MVP Lansmanı & İlk 1000 Kullanıcı', stress: '7/10', learning: '%85 Hızlı Adaptasyon', financial: 'Düşük / Yatırım Aşaması' },
        { year: '3. Yıl (2029)', focus: 'Ürün-Pazar Uyumu & Nakit Akışı', stress: '5/10', learning: '%90 Liderlik', financial: 'Ölçeklenebilir Gelir' },
        { year: '5. Yıl (2031)', focus: 'Sektör Öncülüğü & Finansal Özgürlük', stress: '3/10', learning: '%98 Ustalık', financial: 'Tam Bağımsızlık' }
      ],
      regretScore: '%92 Pişmanlık Önleme'
    },
    {
      id: 'traj-corp',
      name: '🏛️ Kurumsal Uzmanlık & Liderlik',
      color: '#10b981',
      desc: 'Güvenli nakit akışı, net kariyer basamakları ve kurumsal ağ gücü.',
      nodes: [
        { year: '1. Yıl (2027)', focus: 'Kıdemli Pozisyon & Düzenli Tasarruf', stress: '4/10', learning: '%60 Sistemik Öğrenme', financial: 'Sabit & Öngörülebilir' },
        { year: '3. Yıl (2029)', focus: 'Departman / Proje Yönetimi', stress: '6/10', learning: '%70 Politika & Yönetim', financial: 'Yüksek Maaş + Prim' },
        { year: '5. Yıl (2031)', focus: 'Direktörlük veya Bağımsız Danışmanlık', stress: '7/10', learning: '%75 Rutinleşme Riski', financial: 'Konfor Alanı Zirvesi' }
      ],
      regretScore: '%65 Pişmanlık Önleme'
    },
    {
      id: 'traj-nomad',
      name: '🌿 Minimalist & Dijital Otonomi',
      color: '#a855f7',
      desc: 'Düşük masraf, seçici serbest projeler, coğrafi özgürlük ve dinginlik.',
      nodes: [
        { year: '1. Yıl (2027)', focus: 'Sadeleşme & 3 Çekirdek Müşteri', stress: '3/10', learning: '%75 Çok Yönlülük', financial: 'Yeterli & Düşük Maliyet' },
        { year: '3. Yıl (2029)', focus: 'Pasif Gelir Kaynakları & Seyahat', stress: '2/10', learning: '%80 Kültürel Biliş', financial: 'Sürdürülebilir Serbest Akış' },
        { year: '5. Yıl (2031)', focus: 'Kendi Zamanının Mutlak Sahibi Olma', stress: '1/10', learning: '%85 Felsefi Derinlik', financial: 'Dingin Yaşam' }
      ],
      regretScore: '%88 Pişmanlık Önleme'
    }
  ];

  function initTrajectoryView() {
    renderTrajectoryPaths();
  }

  function renderTrajectoryPaths() {
    const grid = document.getElementById('trajectory-branches-grid');
    const verdict = document.getElementById('trajectory-verdict-card');
    if (!grid) return;

    let paths = defaultTrajectories;
    const stored = localStorage.getItem('lumina_user_trajectories');
    if (stored) {
      try {
        const custom = JSON.parse(stored);
        paths = [...defaultTrajectories, ...custom];
      } catch (e) {}
    }

    grid.innerHTML = paths.map(p => `
      <div class="trajectory-branch-col" style="border-top: 3px solid ${p.color};">
        <div class="branch-col-header">
          <div>
            <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${p.name}</h4>
            <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">${p.desc}</p>
          </div>
          <span class="badge-tag" style="background:${p.color}22; color:${p.color}; border:1px solid ${p.color}55;">${p.regretScore}</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${p.nodes.map(n => `
            <div class="trajectory-node-card">
              <div class="branch-horizon-tag">${n.year}</div>
              <div style="font-weight:700; font-size:0.88rem; color:var(--text-main); margin-bottom:0.4rem;">${n.focus}</div>
              <div class="trajectory-metric-row">
                <span style="color:var(--text-muted);">Stres: <strong style="color:#f87171;">${n.stress}</strong></span>
                <span style="color:var(--text-muted);">Öğrenme: <strong style="color:#38bdf8;">${n.learning}</strong></span>
                <span style="color:var(--text-muted);">Finans: <strong style="color:#34d399;">${n.financial}</strong></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    if (verdict) {
      verdict.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem;">
          <span style="font-size:1.5rem;">⚖️</span>
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main);">AI Karar Matrisi & Pişmanlık Simülasyonu</h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">Jeff Bezos Regret Minimization Framework tabanlı kıyaslama</span>
          </div>
        </div>
        <p style="font-size:0.88rem; color:var(--text-main); line-height:1.6;">
          Mevcut alışkanlık istikrarın ve yüksek öğrenme hızın göz önüne alındığında, <strong>"Girişim & Derin İnovasyon"</strong> dalı kısa vadede yüksek belirsizlik barındırsa da, 80 yaş perspektifinde en yüksek tatmini (%92) vaat ediyor. Riskleri dengelemek için ilk 1 yıl minimalist bir bütçe ile prototip odaklı ilerlemek en optimal rotadır.
        </p>
      `;
    }
  }

  function initTrajectoryEvents() {
    const addBtn = document.getElementById('btn-add-trajectory-path');
    const input = document.getElementById('new-trajectory-name');

    if (addBtn && input) {
      addBtn.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) return;

        const newPath = {
          id: `traj-custom-${Date.now()}`,
          name: `✨ ${name}`,
          color: '#fbbf24',
          desc: 'Kullanıcı tarafından modellenen özel yaşam rotası.',
          nodes: [
            { year: '1. Yıl (2027)', focus: 'Temel Hazırlık & Pilot Adımlar', stress: '5/10', learning: '%75 Odak', financial: 'Gelişme Aşaması' },
            { year: '3. Yıl (2029)', focus: 'Yetkinlik & İstikrar', stress: '4/10', learning: '%80 Olgunlaşma', financial: 'Dengeli Gelir' },
            { year: '5. Yıl (2031)', focus: 'Hedefe Ulaşma & Meyveleri Toplama', stress: '2/10', learning: '%90 Ustalık', financial: 'Özgürlük' }
          ],
          regretScore: '%85 Pişmanlık Önleme'
        };

        const stored = localStorage.getItem('lumina_user_trajectories');
        let list = stored ? JSON.parse(stored) : [];
        list.push(newPath);
        localStorage.setItem('lumina_user_trajectories', JSON.stringify(list));

        input.value = '';
        renderTrajectoryPaths();
        window.LuminaAudio.playBeep(520, 'sine', 0.1);
      });
    }
  }

  // =========================================================================
  // DIMENSION 4: ☸️ 360° BÜTÜNSEL YAŞAM DENGESİ (LIFE OS)
  // =========================================================================
  const defaultLifePillars = [
    { id: 'career', name: 'Kariyer & Üretim', icon: '💼', val: 8, color: '#38bdf8' },
    { id: 'health', name: 'Fiziksel Sağlık & Beden', icon: '🏃', val: 7, color: '#10b981' },
    { id: 'mind', name: 'Zihin & İç Huzur', icon: '🧠', val: 8, color: '#a855f7' },
    { id: 'social', name: 'İlişkiler & Sosyal Bağ', icon: '🤝', val: 6, color: '#ec4899' },
    { id: 'finance', name: 'Finansal Güvenlik', icon: '💰', val: 7, color: '#f59e0b' },
    { id: 'learning', name: 'Öğrenme & Gelişim', icon: '📚', val: 9, color: '#6366f1' },
    { id: 'rest', name: 'Dinlenme & Uyku', icon: '🛌', val: 6, color: '#06b6d4' },
    { id: 'meaning', name: 'Anlam & Yaşam Amacı', icon: '🌌', val: 8, color: '#8b5cf6' }
  ];

  let currentLifePillars = [...defaultLifePillars];

  function initLifeOsView() {
    const saved = localStorage.getItem('lumina_life_pillars');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        currentLifePillars = defaultLifePillars.map(p => {
          const found = parsed.find(x => x.id === p.id);
          return found ? { ...p, val: found.val } : p;
        });
      } catch (e) {}
    }

    renderLifeSliders();
    drawLifeWheelSVG();
    updateLifeBurnoutStatus();
  }

  function renderLifeSliders() {
    const list = document.getElementById('life-sliders-list');
    if (!list) return;

    list.innerHTML = currentLifePillars.map(p => `
      <div class="life-slider-row" data-id="${p.id}">
        <div class="slider-meta-header">
          <span>${p.icon} ${p.name}</span>
          <strong id="val-tag-${p.id}" style="color:${p.color};">${p.val} / 10</strong>
        </div>
        <input type="range" class="life-range-input" id="slider-${p.id}" min="1" max="10" step="1" value="${p.val}">
      </div>
    `).join('');

    currentLifePillars.forEach(p => {
      const slider = document.getElementById(`slider-${p.id}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          const newVal = parseInt(e.target.value, 10);
          p.val = newVal;
          const tag = document.getElementById(`val-tag-${p.id}`);
          if (tag) tag.textContent = `${newVal} / 10`;

          localStorage.setItem('lumina_life_pillars', JSON.stringify(currentLifePillars));
          drawLifeWheelSVG();
          updateLifeBurnoutStatus();
        });
      }
    });
  }

  function drawLifeWheelSVG() {
    const svg = document.getElementById('life-wheel-svg');
    if (!svg) return;

    const size = 320;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = 110;
    const numAxes = currentLifePillars.length;

    let svgHtml = '';

    // Concentric Web Grid (Levels 2, 4, 6, 8, 10)
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(level => {
      let gridPoints = [];
      for (let i = 0; i < numAxes; i++) {
        const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * (maxR * level);
        const y = cy + Math.sin(angle) * (maxR * level);
        gridPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      svgHtml += `<polygon points="${gridPoints.join(' ')}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    });

    // Radial Axis Lines & Labels
    currentLifePillars.forEach((p, i) => {
      const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
      const x2 = cx + Math.cos(angle) * maxR;
      const y2 = cy + Math.sin(angle) * maxR;
      svgHtml += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;

      // Icon/Label outside
      const lx = cx + Math.cos(angle) * (maxR + 24);
      const ly = cy + Math.sin(angle) * (maxR + 24);
      svgHtml += `<text x="${lx}" y="${ly}" font-size="12" text-anchor="middle" dominant-baseline="central">${p.icon}</text>`;
    });

    // Filled User Polygon
    let polyPoints = [];
    currentLifePillars.forEach((p, i) => {
      const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
      const r = (p.val / 10) * maxR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      polyPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    });

    svgHtml += `
      <polygon points="${polyPoints.join(' ')}" fill="url(#lifeWheelGrad)" stroke="#38bdf8" stroke-width="2.5" filter="url(#glowFilter)"/>
      <defs>
        <linearGradient id="lifeWheelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.3"/>
        </linearGradient>
        <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
    `;

    // Vertex points
    currentLifePillars.forEach((p, i) => {
      const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
      const r = (p.val / 10) * maxR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      svgHtml += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${p.color}" stroke="#0f172a" stroke-width="1.5"/>`;
    });

    svg.innerHTML = svgHtml;
  }

  function updateLifeBurnoutStatus() {
    const totalScore = currentLifePillars.reduce((acc, p) => acc + p.val, 0);
    const avgScore = Math.round((totalScore / (currentLifePillars.length * 10)) * 100);

    const scoreTag = document.getElementById('life-balance-score-tag');
    if (scoreTag) scoreTag.textContent = `Denge: %${avgScore}`;

    // Burnout heuristic: Work/Finance vs Rest/Health/Mind
    const workIntensity = (currentLifePillars.find(p => p.id === 'career')?.val || 5) + (currentLifePillars.find(p => p.id === 'finance')?.val || 5);
    const recoveryCapacity = (currentLifePillars.find(p => p.id === 'rest')?.val || 5) + (currentLifePillars.find(p => p.id === 'health')?.val || 5) + (currentLifePillars.find(p => p.id === 'mind')?.val || 5);

    const gap = workIntensity - (recoveryCapacity / 1.5);
    const banner = document.getElementById('burnout-warning-banner');
    const icon = document.getElementById('burnout-status-icon');
    const title = document.getElementById('burnout-status-title');
    const desc = document.getElementById('burnout-status-desc');

    if (!banner || !title || !desc) return;

    if (gap > 4) {
      banner.className = 'burnout-warning-banner high-risk';
      if (icon) icon.textContent = '🚨';
      title.textContent = 'Tükenmişlik Riski: Yüksek (%78)';
      desc.textContent = 'Üretim ve kariyer talepleri, dinlenme ve beden yenilenmesini ciddi oranda aşıyor. Bugün acil dinlenme blokları planla!';
    } else if (gap > 1.5) {
      banner.className = 'burnout-warning-banner';
      if (icon) icon.textContent = '🟡';
      title.textContent = 'Tükenmişlik Riski: Orta (%42)';
      desc.textContent = 'Kariyer ve tempo yüksek, ancak uyku ve zihin dengesini korumak için sınır koymalısın.';
    } else {
      banner.className = 'burnout-warning-banner';
      if (icon) icon.textContent = '🟢';
      title.textContent = 'Tükenmişlik Riski: Düşük (%15)';
      desc.textContent = 'Bütünsel yaşam alanların uyumlu ve dengeli seyrediyor. Zihinsel dayanıklılık zirvede.';
    }
  }

  function initLifeOsEvents() {
    const blueprintBtn = document.getElementById('btn-rebalance-blueprint');
    const outputCard = document.getElementById('rebalance-blueprint-output');

    if (blueprintBtn && outputCard) {
      blueprintBtn.addEventListener('click', () => {
        // Find 2 lowest pillars
        const sorted = [...currentLifePillars].sort((a, b) => a.val - b.val);
        const low1 = sorted[0];
        const low2 = sorted[1];

        outputCard.style.display = 'block';
        outputCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.4rem;">⚡</span>
              <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main);">7 Günlük Bilişsel Denge Blueprint'i</h3>
            </div>
            <span class="badge-tag" style="background:#10b98122; color:#34d399; border:1px solid #10b98144;">Otomatik Optimize Edildi</span>
          </div>

          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">
            Analiz sonucu yaşam çarkında en çok ihmal edilen iki sütun: <strong style="color:${low1.color};">${low1.icon} ${low1.name} (${low1.val}/10)</strong> ve <strong style="color:${low2.color};">${low2.icon} ${low2.name} (${low2.val}/10)</strong>. Sistem dengesini yeniden kurmak için 3 mikro eylem:
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
            <div style="padding:1rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); border-left:3px solid ${low1.color};">
              <div style="font-size:0.78rem; font-weight:700; color:${low1.color}; margin-bottom:0.25rem;">GÜN 1-3 • KÖK MÜDAHALE</div>
              <strong style="color:var(--text-main); font-size:0.9rem;">${low1.name} için 20 Dakikalık Blok</strong>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">Her gün sabah ilk iş bu alana yönelik tek bir mikrotask tamamla.</p>
            </div>
            <div style="padding:1rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); border-left:3px solid ${low2.color};">
              <div style="font-size:0.78rem; font-weight:700; color:${low2.color}; margin-bottom:0.25rem;">GÜN 4-5 • DENGELEME</div>
              <strong style="color:var(--text-main); font-size:0.9rem;">${low2.name} Sınırı Koy</strong>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">Aşırı efor harcanan alanlardan %10 kısıp bu alana aktar.</p>
            </div>
            <div style="padding:1rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); border-left:3px solid #38bdf8;">
              <div style="font-size:0.78rem; font-weight:700; color:#38bdf8; margin-bottom:0.25rem;">GÜN 6-7 • GÖZDEN GEÇİRME</div>
              <strong style="color:var(--text-main); font-size:0.9rem;">Haftalık Çark Kalibrasyonu</strong>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">Pazar akşamı Life OS çarkını yeniden puanlayarak ilerlemeyi teyit et.</p>
            </div>
          </div>
        `;

        window.LuminaAudio.playBeep(600, 'sine', 0.15);
      });
    }
  }

  // =========================================================================
  // DIMENSION 5: 🚨 ZİHİNSEL KRİZ & BİLİŞSEL SOS OVERLAY
  // =========================================================================
  let sosBreathActive = false;
  let sosBreathInterval = null;
  let sosPhaseTime = 0;
  let sosTotalSeconds = 60;
  let sosPhase = 'inhale1'; // 'inhale1' (2.5s) -> 'inhale2' (1.0s) -> 'exhale' (5.0s)

  function initEmergencySOS() {
    const sosBtn = document.getElementById('btn-emergency-sos');
    const overlay = document.getElementById('emergency-overlay');
    const closeBtn = document.getElementById('btn-close-emergency');
    const tabs = document.querySelectorAll('.emergency-tab-btn');
    const tabPanels = document.querySelectorAll('.emergency-tab-panel');
    const breathBtn = document.getElementById('btn-toggle-sos-breath');
    const groundingChecks = document.querySelectorAll('.grounding-chk-btn');

    if (!sosBtn || !overlay) return;

    function openEmergency() {
      overlay.style.display = 'flex';
      window.LuminaAudio.playBeep(330, 'sine', 0.2);
    }

    function closeEmergency() {
      overlay.style.display = 'none';
      stopSosBreathing();
    }

    sosBtn.addEventListener('click', openEmergency);
    if (closeBtn) closeBtn.addEventListener('click', closeEmergency);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display === 'flex') {
        closeEmergency();
      }
    });

    // Tab Navigation
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        const panel = document.getElementById(`emergency-tab-${target}`);
        if (panel) panel.style.display = 'block';
      });
    });

    // Physiological Sigh Loop
    if (breathBtn) {
      breathBtn.addEventListener('click', () => {
        if (sosBreathActive) {
          stopSosBreathing();
        } else {
          startSosBreathing();
        }
      });
    }

    function startSosBreathing() {
      sosBreathActive = true;
      sosTotalSeconds = 60;
      sosPhase = 'inhale1';
      sosPhaseTime = 3;
      if (breathBtn) breathBtn.querySelector('span').textContent = 'Döngüyü Duraklat';

      updateBreathUI();

      sosBreathInterval = setInterval(() => {
        sosPhaseTime--;
        sosTotalSeconds--;

        if (sosPhaseTime <= 0) {
          if (sosPhase === 'inhale1') {
            sosPhase = 'inhale2';
            sosPhaseTime = 1;
            window.LuminaAudio.playBeep(520, 'sine', 0.08);
          } else if (sosPhase === 'inhale2') {
            sosPhase = 'exhale';
            sosPhaseTime = 5;
            window.LuminaAudio.playBeep(380, 'sine', 0.15);
          } else {
            sosPhase = 'inhale1';
            sosPhaseTime = 3;
            window.LuminaAudio.playBeep(440, 'sine', 0.1);
          }
        }

        updateBreathUI();

        if (sosTotalSeconds <= 0) {
          stopSosBreathing();
          const guide = document.getElementById('sos-breath-guidance');
          if (guide) guide.innerHTML = '✨ <strong>Harika.</strong> Nabzın ve kandaki karbondioksit dengelendi.';
        }
      }, 1000);
    }

    function stopSosBreathing() {
      sosBreathActive = false;
      if (sosBreathInterval) clearInterval(sosBreathInterval);
      sosBreathInterval = null;
      if (breathBtn) breathBtn.querySelector('span').textContent = 'Nefes Döngüsünü Başlat';

      const orb = document.getElementById('sos-breath-orb');
      if (orb) orb.className = 'sos-breath-orb';
    }

    function updateBreathUI() {
      const orb = document.getElementById('sos-breath-orb');
      const phaseTag = document.getElementById('sos-breath-phase');
      const timerTag = document.getElementById('sos-breath-timer');
      const guidance = document.getElementById('sos-breath-guidance');

      if (!orb || !phaseTag || !timerTag || !guidance) return;

      orb.className = `sos-breath-orb ${sosPhase}`;
      timerTag.textContent = `${sosPhaseTime}s`;

      if (sosPhase === 'inhale1') {
        phaseTag.textContent = '1. Derin Burun Nefesi';
        guidance.textContent = 'Burnundan ciğerlerini %80 doldur...';
      } else if (sosPhase === 'inhale2') {
        phaseTag.textContent = '2. Hızlı Ekstra Çekiş';
        guidance.textContent = 'Ciğerlerinin en tepesine küçük bir hava daha ekle!';
      } else {
        phaseTag.textContent = '3. Yavaş Ağız Nefesi';
        guidance.textContent = 'Dudaklarını büz ve havayı yavaşça bırak...';
      }
    }

    // Grounding Checklist
    groundingChecks.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.grounding-step-item');
        if (item) {
          item.classList.toggle('checked');
          window.LuminaAudio.playBeep(item.classList.contains('checked') ? 600 : 350, 'sine', 0.08);
        }
      });
    });
  }

  // --- Initial Render & Dimension Event Wiring ---
  initEmergencySOS();
  initGalaxyEvents();
  initTwinEvents();
  initTrajectoryEvents();
  initLifeOsEvents();

  // =========================================================================
  // DIMENSION 6 & 8: ⏳ CHRONOS & MEMENTO MORI (VIEW 11)
  // =========================================================================
  const defaultCapsules = [
    {
      id: 'cap-init-1',
      title: '🌱 Lumina AI Başlangıç Yemini',
      condition: 'days-30',
      conditionText: '30 Gün Sonra Açılacak',
      body: 'Bu yolculuğa başlarken kendime söz verdim: Kolay yolu değil, karakterimi inşa edecek doğru yolu seçeceğim. 30 gün sonra buraya baktığımda disiplinimin güçlendiğini görmek istiyorum.',
      createdAt: new Date().toLocaleDateString('tr-TR'),
      unlockDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString('tr-TR'),
      opened: false
    }
  ];

  function initChronosView() {
    renderCapsulesVault();
    renderMementoMoriGrid();
    renderTimelineScrubberSnapshot(0);
  }

  function initChronosEvents() {
    // Sub-tab Navigation
    const pills = document.querySelectorAll('.chronos-nav-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const target = pill.getAttribute('data-tab');
        document.querySelectorAll('.chronos-tab-panel').forEach(panel => panel.style.display = 'none');
        const activePanel = document.getElementById(`chronos-panel-${target}`);
        if (activePanel) activePanel.style.display = 'block';
      });
    });

    // Seal Capsule Button
    const sealBtn = document.getElementById('btn-seal-capsule');
    const titleInput = document.getElementById('capsule-title');
    const condSelect = document.getElementById('capsule-unlock-condition');
    const bodyInput = document.getElementById('capsule-body');

    if (sealBtn) {
      sealBtn.addEventListener('click', () => {
        const title = titleInput ? titleInput.value.trim() : '';
        const body = bodyInput ? bodyInput.value.trim() : '';
        const cond = condSelect ? condSelect.value : 'days-30';

        if (!title || !body) {
          alert('Lütfen kapsül başlığı ve geleceğe mektubunuzu yazın.');
          return;
        }

        const condDaysMap = { 'days-30': 30, 'days-90': 90, 'days-180': 180, 'days-365': 365, 'lvl-5': 60, 'lvl-10': 120 };
        const days = condDaysMap[cond] || 30;
        const unlockDate = new Date(Date.now() + days * 24 * 3600 * 1000).toLocaleDateString('tr-TR');

        const newCapsule = {
          id: `cap-${Date.now()}`,
          title: title,
          condition: cond,
          conditionText: condSelect ? condSelect.options[condSelect.selectedIndex].text : 'Belirlenen Tarihte',
          body: body,
          createdAt: new Date().toLocaleDateString('tr-TR'),
          unlockDate: unlockDate,
          opened: false
        };

        const stored = localStorage.getItem('lumina_chronos_capsules');
        let list = stored ? JSON.parse(stored) : defaultCapsules;
        list.unshift(newCapsule);
        localStorage.setItem('lumina_chronos_capsules', JSON.stringify(list));

        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';

        if (window.LuminaSanctum) window.LuminaSanctum.addXP(30);
        updateTopbarRPG();
        renderCapsulesVault();
        window.LuminaAudio.playBeep(440, 'triangle', 0.2);
        alert('🔒 Kapsülünüz zaman boşluğuna mühürlendi! Günü geldiğinde açılacaktır (+30 XP).');
      });
    }

    // Memento Mori Birth Year Input
    const birthInput = document.getElementById('memento-birth-year');
    if (birthInput) {
      const savedYear = localStorage.getItem('lumina_birth_year');
      if (savedYear) birthInput.value = savedYear;
      birthInput.addEventListener('change', () => {
        localStorage.setItem('lumina_birth_year', birthInput.value);
        renderMementoMoriGrid();
      });
    }

    // Timeline Scrubber Slider
    const scrubber = document.getElementById('timeline-scrubber-range');
    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        renderTimelineScrubberSnapshot(parseInt(e.target.value, 10));
      });
    }
  }

  function renderCapsulesVault() {
    const listEl = document.getElementById('capsules-vault-list');
    const badge = document.getElementById('capsules-count-badge');
    if (!listEl) return;

    const stored = localStorage.getItem('lumina_chronos_capsules');
    const capsules = stored ? JSON.parse(stored) : defaultCapsules;

    if (badge) badge.textContent = `${capsules.length} Kapsül`;

    listEl.innerHTML = capsules.map(c => `
      <div class="capsule-item-card ${c.opened ? 'unlocked' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:var(--text-main); font-size:0.95rem;">${c.opened ? '🔓' : '🔒'} ${c.title}</strong>
          <span style="font-size:0.75rem; color:#a855f7; font-weight:700;">${c.conditionText}</span>
        </div>
        <div class="capsule-meta-row">
          <span>Mühürlendi: ${c.createdAt}</span>
          <span>Açılış: ${c.unlockDate}</span>
        </div>
        <div style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; margin-top:0.35rem;">
          ${c.opened ? c.body : '<em>Bu kapsülün içeriği henüz kilit altındadır. Gelecekteki açılış gününde bilincinizle yüzleşecektir.</em>'}
        </div>
        ${!c.opened ? `
          <div style="margin-top:0.5rem;">
            <button class="btn-secondary btn-open-capsule" data-id="${c.id}" style="font-size:0.75rem; padding:0.25rem 0.65rem;">Kilidi Şimdi Zorla / Oku 👁️</button>
          </div>
        ` : ''}
      </div>
    `).join('');

    listEl.querySelectorAll('.btn-open-capsule').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const stored = localStorage.getItem('lumina_chronos_capsules');
        let list = stored ? JSON.parse(stored) : defaultCapsules;
        const target = list.find(x => x.id === id);
        if (target) {
          target.opened = true;
          localStorage.setItem('lumina_chronos_capsules', JSON.stringify(list));
          renderCapsulesVault();
          window.LuminaAudio.playBeep(660, 'sine', 0.15);
        }
      });
    });
  }

  function renderMementoMoriGrid() {
    const grid = document.getElementById('memento-grid');
    const livedWeeksTag = document.getElementById('memento-lived-weeks');
    const livedPercentTag = document.getElementById('memento-lived-percent');
    const remainingTag = document.getElementById('memento-remaining-weeks');
    const birthInput = document.getElementById('memento-birth-year');
    if (!grid) return;

    const birthYear = birthInput ? parseInt(birthInput.value, 10) || 2000 : 2000;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const elapsedWeeks = Math.max(0, (currentYear - birthYear) * 52 + Math.floor(currentMonth * 4.33));
    const totalWeeks = 80 * 52; // 4,160 weeks
    const remainingWeeks = Math.max(0, totalWeeks - elapsedWeeks);
    const livedPercent = ((elapsedWeeks / totalWeeks) * 100).toFixed(1);

    if (livedWeeksTag) livedWeeksTag.textContent = elapsedWeeks.toLocaleString('tr-TR');
    if (livedPercentTag) livedPercentTag.textContent = `%${livedPercent}`;
    if (remainingTag) remainingTag.textContent = remainingWeeks.toLocaleString('tr-TR');

    // Create 4,160 dots efficiently via documentFragment
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < totalWeeks; i++) {
      const dot = document.createElement('div');
      dot.className = 'memento-dot';
      if (i < elapsedWeeks) {
        dot.classList.add('lived');
        dot.title = `Hafta ${i + 1}: Yaşandı ve Geleceğe Katıldı`;
      } else if (i === elapsedWeeks) {
        dot.classList.add('current');
        dot.title = `BU HAFTA (Hafta ${i + 1}): Elindeki Tek Gerçek An!`;
      } else {
        dot.title = `Hafta ${i + 1}: Potansiyel Gelecek`;
      }
      frag.appendChild(dot);
    }
    grid.appendChild(frag);
  }

  function renderTimelineScrubberSnapshot(daysAgo) {
    const tag = document.getElementById('scrubber-active-date-tag');
    const snapshotEl = document.getElementById('timeline-day-snapshot');
    if (!snapshotEl) return;

    const targetDate = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
    const dateStr = targetDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    if (tag) tag.textContent = daysAgo === 0 ? 'Bugün (Şimdi)' : `${daysAgo} Gün Önce`;

    const focusMinutes = daysAgo === 0 ? 50 : Math.max(25, 120 - daysAgo * 3);
    const tasksDone = daysAgo === 0 ? 3 : (daysAgo % 4) + 1;
    const moodState = daysAgo % 3 === 0 ? 'Yüksek Odak & Bilişsel Berraklık' : (daysAgo % 3 === 1 ? 'Stoacı Dinginlik & Rutin' : 'Derin Stratejik Planlama');

    snapshotEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
        <div>
          <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${dateStr}</h4>
          <span style="font-size:0.78rem; color:var(--secondary);">${daysAgo === 0 ? 'Şu Anki Durum' : 'Geçmiş Zihinsel İzdüşüm'}</span>
        </div>
        <span class="badge-tag" style="background:#8b5cf622; color:#c084fc; border:1px solid #8b5cf644;">${moodState}</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
        <div style="padding:0.85rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Tamamlanan Görevler</div>
          <strong style="font-size:1.25rem; color:#38bdf8;">${tasksDone} Görev</strong>
        </div>
        <div style="padding:0.85rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Derin Çalışma Süresi</div>
          <strong style="font-size:1.25rem; color:#34d399;">${focusMinutes} Dakika</strong>
        </div>
        <div style="padding:0.85rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Felsefi Çapa</div>
          <strong style="font-size:0.95rem; color:#f59e0b;">Kontrol Alanı Bilinci</strong>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // DIMENSION 7: 🧬 BİYO-HACK & MENTAL RAM (VIEW 12)
  // =========================================================================
  let caffeineTimerSeconds = 90 * 60;
  let caffeineInterval = null;
  let nsdrTimerSeconds = 20 * 60;
  let nsdrInterval = null;

  function initBiohackView() {
    renderMentalRamGauge();
  }

  function initBiohackEvents() {
    // Biohack Tabs
    const pills = document.querySelectorAll('.biohack-nav-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const target = pill.getAttribute('data-tab');
        document.querySelectorAll('.biohack-tab-panel').forEach(p => p.style.display = 'none');
        const active = document.getElementById(`biohack-panel-${target}`);
        if (active) active.style.display = 'block';
      });
    });

    // Caffeine Timer
    const caffBtn = document.getElementById('btn-toggle-caffeine-timer');
    const caffReset = document.getElementById('btn-reset-caffeine-timer');
    const caffDisplay = document.getElementById('caffeine-timer-display');

    if (caffBtn && caffDisplay) {
      caffBtn.addEventListener('click', () => {
        if (caffeineInterval) {
          clearInterval(caffeineInterval);
          caffeineInterval = null;
          caffBtn.querySelector('span').textContent = '⏱️ Sayacı Başlat';
        } else {
          caffBtn.querySelector('span').textContent = '⏸️ Duraklat';
          caffeineInterval = setInterval(() => {
            caffeineTimerSeconds--;
            const m = String(Math.floor(caffeineTimerSeconds / 60)).padStart(2, '0');
            const s = String(caffeineTimerSeconds % 60).padStart(2, '0');
            caffDisplay.textContent = `${m}:${s}`;
            if (caffeineTimerSeconds <= 0) {
              clearInterval(caffeineInterval);
              caffeineInterval = null;
              caffDisplay.textContent = '00:00';
              alert('☕ Adenozin temizliği tamamlandı! Şimdi ilk kahvenizi içebilirsiniz.');
            }
          }, 1000);
        }
      });
    }

    if (caffReset && caffDisplay) {
      caffReset.addEventListener('click', () => {
        if (caffeineInterval) clearInterval(caffeineInterval);
        caffeineInterval = null;
        caffeineTimerSeconds = 90 * 60;
        caffDisplay.textContent = '90:00';
        if (caffBtn) caffBtn.querySelector('span').textContent = '⏱️ Sayacı Başlat';
      });
    }

    // NSDR Timer
    const nsdrBtn = document.getElementById('btn-toggle-nsdr');
    const nsdrDisplay = document.getElementById('nsdr-timer-display');
    if (nsdrBtn && nsdrDisplay) {
      nsdrBtn.addEventListener('click', () => {
        if (nsdrInterval) {
          clearInterval(nsdrInterval);
          nsdrInterval = null;
          document.getElementById('nsdr-btn-label').textContent = '▶️ NSDR Seansını Başlat';
        } else {
          document.getElementById('nsdr-btn-label').textContent = '⏸️ Seansı Duraklat';
          window.LuminaAudio.playBeep(210, 'sine', 0.2);
          nsdrInterval = setInterval(() => {
            nsdrTimerSeconds--;
            const m = String(Math.floor(nsdrTimerSeconds / 60)).padStart(2, '0');
            const s = String(nsdrTimerSeconds % 60).padStart(2, '0');
            nsdrDisplay.textContent = `${m}:${s}`;
            if (nsdrTimerSeconds <= 0) {
              clearInterval(nsdrInterval);
              nsdrInterval = null;
              nsdrDisplay.textContent = '20:00';
              alert('✨ 20 dakikalık NSDR tamamlandı. Dopamin rezervleriniz ve bilişsel odağınız sıfırlandı!');
            }
          }, 1000);
        }
      });
    }

    // Brain Dump Flush Processor
    const dumpBtn = document.getElementById('btn-process-brain-dump');
    const dumpInput = document.getElementById('brain-dump-input');
    const dumpGrid = document.getElementById('dump-results-grid');

    if (dumpBtn && dumpInput && dumpGrid) {
      dumpBtn.addEventListener('click', () => {
        const text = dumpInput.value.trim();
        if (!text) {
          alert('Lütfen zihninizdekileri metin kutusuna yazın.');
          return;
        }

        const lines = text.split(/[\n,\.]+/).map(l => l.trim()).filter(l => l.length > 2);
        const actions = [];
        const notes = [];
        const junk = [];

        lines.forEach(line => {
          const lower = line.toLowerCase();
          if (lower.includes('yap') || lower.includes('et') || lower.includes('ara') || lower.includes('gönder') || lower.includes('mail') || lower.includes('bitir') || lower.includes('al')) {
            actions.push(line);
          } else if (lower.includes('kork') || lower.includes('endişe') || lower.includes('canım') || lower.includes('acaba') || lower.includes('bıktım')) {
            junk.push(line);
          } else {
            notes.push(line);
          }
        });

        dumpGrid.style.display = 'grid';
        dumpGrid.innerHTML = `
          <div class="dump-col-card" style="border-left:3px solid #38bdf8;">
            <h4 style="font-size:0.95rem; font-weight:800; color:#38bdf8; margin-bottom:0.5rem;">🎯 Acil Eylemler (${actions.length})</h4>
            <div style="font-size:0.8rem; color:var(--text-muted);">${actions.length ? actions.map(a => `<div>• ${a}</div>`).join('') : 'Eylem bulunamadı.'}</div>
          </div>
          <div class="dump-col-card" style="border-left:3px solid #10b981;">
            <h4 style="font-size:0.95rem; font-weight:800; color:#10b981; margin-bottom:0.5rem;">📋 Referans & Notlar (${notes.length})</h4>
            <div style="font-size:0.8rem; color:var(--text-muted);">${notes.length ? notes.map(n => `<div>• ${n}</div>`).join('') : 'Not bulunamadı.'}</div>
          </div>
          <div class="dump-col-card" style="border-left:3px solid #ef4444;">
            <h4 style="font-size:0.95rem; font-weight:800; color:#ef4444; margin-bottom:0.5rem;">🗑️ Boşluğa Yakılan Kuruntular (${junk.length})</h4>
            <div style="font-size:0.8rem; color:var(--text-muted);">${junk.length ? junk.map(j => `<div>• <del>${j}</del></div>`).join('') : 'Gürültü yok.'}</div>
          </div>
        `;

        // Instantly reduce mental RAM
        const ramVal = document.getElementById('ram-percent-value');
        const ramTag = document.getElementById('ram-status-tag');
        if (ramVal) ramVal.textContent = '22%';
        if (ramTag) {
          ramTag.textContent = '🟢 Zihinsel RAM Boşaltıldı & Berraklaştı (%22)';
          ramTag.style.color = '#34d399';
        }

        if (window.LuminaSanctum) window.LuminaSanctum.addXP(25);
        updateTopbarRPG();
        window.LuminaAudio.playBeep(580, 'sine', 0.15);
      });
    }

    // Quick Flush Nav Button in RAM tab
    const quickFlushBtn = document.getElementById('btn-quick-flush-nav');
    if (quickFlushBtn) {
      quickFlushBtn.addEventListener('click', () => {
        document.querySelectorAll('.biohack-nav-pill').forEach(p => p.classList.remove('active'));
        const flushPill = document.querySelector('.biohack-nav-pill[data-tab="flush"]');
        if (flushPill) flushPill.classList.add('active');
        document.querySelectorAll('.biohack-tab-panel').forEach(p => p.style.display = 'none');
        const active = document.getElementById('biohack-panel-flush');
        if (active) active.style.display = 'block';
      });
    }
  }

  function renderMentalRamGauge() {
    const list = document.getElementById('open-loops-list');
    const ramVal = document.getElementById('ram-percent-value');
    if (!list) return;

    const tasks = (window.LuminaStorage.getTasks() || []).filter(t => !t.completed);
    const calculatedRam = Math.min(94, Math.max(25, 30 + tasks.length * 8));
    if (ramVal) ramVal.textContent = `${calculatedRam}%`;

    list.innerHTML = tasks.slice(0, 6).map((t, i) => `
      <div class="open-loop-item">
        <span>${t.title}</span>
        <span class="badge-tag" style="background:#ef444422; color:#f87171; border:1px solid #ef444444;">%${12 - i} RAM Tüketimi</span>
      </div>
    `).join('') || '<div style="font-size:0.85rem; color:var(--text-muted);">Hiç açık döngü yok. RAM tamamen temiz!</div>';
  }

  // =========================================================================
  // DIMENSION 9 & 10: 🔬 FİKİR KAYNAŞTIRICI & SOKRATİK MAHKEME (VIEW 13)
  // =========================================================================
  function initSynthesizerView() {}

  function initSynthesizerEvents() {
    // Tabs
    const pills = document.querySelectorAll('.synth-nav-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const target = pill.getAttribute('data-tab');
        document.querySelectorAll('.synth-tab-panel').forEach(p => p.style.display = 'none');
        const active = document.getElementById(`synth-panel-${target}`);
        if (active) active.style.display = 'block';
      });
    });

    // Preset buttons for Crucible
    const presets = document.querySelectorAll('.crucible-preset-btn');
    const c1Input = document.getElementById('crucible-concept-1');
    const c2Input = document.getElementById('crucible-concept-2');

    presets.forEach(p => {
      p.addEventListener('click', () => {
        if (c1Input) c1Input.value = p.getAttribute('data-c1') || '';
        if (c2Input) c2Input.value = p.getAttribute('data-c2') || '';
      });
    });

    // Fire Crucible
    const fireBtn = document.getElementById('btn-fire-crucible');
    const crucibleOut = document.getElementById('crucible-output-card');

    if (fireBtn && crucibleOut) {
      fireBtn.addEventListener('click', () => {
        const c1 = c1Input ? c1Input.value.trim() : 'Stoacılık';
        const c2 = c2Input ? c2Input.value.trim() : 'Girişimcilik';

        crucibleOut.style.display = 'block';
        crucibleOut.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
            <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main);">✨ Sentez Ürünü: "${c1} Odaklı ${c2} Manifestosu"</h4>
            <span class="badge-tag" style="background:#ec489922; color:#f472b6; border:1px solid #ec489955;">Simya Tamamlandı</span>
          </div>

          <div style="font-size:0.9rem; color:var(--text-main); line-height:1.6; margin-bottom:1rem;">
            <strong>Beklenmedik Analoji:</strong> ${c1} disiplinindeki içsel kontrol ve dilsiz kabul, ${c2} alanındaki belirsizlik stresini sıfırlayan nihai zırhtır. Dış başarıyı kontrol edemezsin, ancak harcadığın eforun kalitesini kontrol edersin.
          </div>

          <div style="padding:0.85rem 1rem; background:rgba(0,0,0,0.3); border-radius:var(--radius-md); font-size:0.83rem; color:#38bdf8; margin-bottom:1rem;">
            💡 <strong>Pratik Eylem Hamlesi:</strong> Önümüzdeki 7 gün boyunca ${c2} hedefini ${c1} süzgecinden geçirerek günlük 1 sarsılmaz kural belirle.
          </div>

          <button class="btn-primary" id="btn-save-synthesis-note" style="font-size:0.82rem; padding:0.4rem 1rem;">
            <span>📋 Bu Sentezi Not Defterine Kaydet</span>
          </button>
        `;

        const saveNoteBtn = document.getElementById('btn-save-synthesis-note');
        if (saveNoteBtn) {
          saveNoteBtn.addEventListener('click', () => {
            const notes = window.LuminaStorage.getNotes() || [];
            notes.unshift({
              id: Date.now(),
              title: `${c1} + ${c2} Sentezi`,
              body: `${c1} ve ${c2} disiplinlerinin simyası: İçsel kontrol ve kaliteli efor odaklı yaşam stratejisi.`,
              updatedAt: new Date().toISOString()
            });
            window.LuminaStorage.saveNotes(notes);
            alert('Sentez AI Not Defterine kaydedildi!');
          });
        }

        window.LuminaAudio.playBeep(520, 'triangle', 0.15);
      });
    }

    // Socratic Court Judge
    const judgeBtn = document.getElementById('btn-judge-court');
    const dilemmaInput = document.getElementById('court-dilemma-input');
    const defenseInput = document.getElementById('court-defense-input');
    const prosecInput = document.getElementById('court-prosecutor-input');
    const verdictBox = document.getElementById('court-verdict-box');

    if (judgeBtn && verdictBox) {
      judgeBtn.addEventListener('click', () => {
        const dilemma = dilemmaInput ? dilemmaInput.value.trim() : 'Mevcut İkilem';
        const defense = defenseInput ? defenseInput.value.trim() : 'İçimdeki arzu';
        const prosec = prosecInput ? prosecInput.value.trim() : 'Korkularım';

        verdictBox.style.display = 'block';
        verdictBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
            <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main);">⚖️ Sokratik Duruşma Kararı: "${dilemma}"</h4>
            <span class="badge-tag" style="background:#38bdf822; color:#38bdf8; border:1px solid #38bdf855;">Rasyonel Sentez</span>
          </div>

          <div style="font-size:0.85rem; color:#f87171; margin-bottom:0.75rem;">
            ⚠️ <strong>Tespit Edilen Bilişsel Çarpıtma:</strong> <em>"Ya Hep Ya Hiç (Siyah-Beyaz Düşünme)"</em>. Zihnin durumu 'ya tamamen başarılı olacağım ya da aç kalacağım' gibi iki uç noktaya sıkıştırıyor. Gerçek hayatta gri alanlar ve güvenli geçiş modelleri vardır.
          </div>

          <div style="font-size:0.88rem; color:var(--text-main); line-height:1.6; margin-bottom:1rem;">
            <strong>Sokratik Sentez Kararı:</strong> Radikal bir köprü yakma eylemi yerine, ilk 3 ay yan proje modeliyle prototip doğrulaması yap. Şeytanın avukatının haklı olduğu tek nokta nakit akışıdır; bu risk tamponlanarak tutkunun peşinden gidilmelidir.
          </div>

          <div style="padding:0.75rem 1rem; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); font-size:0.82rem; color:#34d399;">
            ✅ <strong>Karar Mührü:</strong> Karar felci kaldırıldı. Kararını 24 saat içinde ilk pilot adımı atarak hayata geçir.
          </div>
        `;

        window.LuminaAudio.playBeep(440, 'sine', 0.2);
      });
    }
  }

  // =========================================================================
  // DIMENSION 11 & 12: 📜 DEĞERLER ANAYASASI & BİYOPSİ (VIEW 14)
  // =========================================================================
  const defaultPrinciples = [
    'Duygularımla değil, uzun vadeli değerlerim ve ilkelerimle karar veririm.',
    'En zor ve zihinsel direnç yaratan görevi günün ilk saatinde tamamlarım.',
    'Başkalarının geçici övgüsüne değil, kendi karakterimin tutarlılığına bakarım.',
    'Kontrolüm dışındaki gelişmeleri dilsiz bir sükunetle ve bilgelikle kabul ederim.',
    'Ertelemek bir zaman tasarrufu değil, gelecekteki huzurumdan tefeci faiziyle borç almaktır.',
    'Hata yapmak doğal bir keşiftir; aynı hatayı tekrarlamak ise ihmaldir.'
  ];

  function initCodexView() {
    renderPrinciplesList();
    renderWeeklyAutopsyReport();
  }

  function initCodexEvents() {
    // Tabs
    const pills = document.querySelectorAll('.codex-nav-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const target = pill.getAttribute('data-tab');
        document.querySelectorAll('.codex-tab-panel').forEach(p => p.style.display = 'none');
        const active = document.getElementById(`codex-panel-${target}`);
        if (active) active.style.display = 'block';
      });
    });

    // Add Principle
    const addBtn = document.getElementById('btn-add-principle');
    const input = document.getElementById('new-principle-input');
    if (addBtn && input) {
      addBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        const stored = localStorage.getItem('lumina_codex_principles');
        let list = stored ? JSON.parse(stored) : defaultPrinciples;
        list.push(text);
        localStorage.setItem('lumina_codex_principles', JSON.stringify(list));
        input.value = '';
        renderPrinciplesList();
        window.LuminaAudio.playBeep(520, 'sine', 0.1);
      });
    }

    // Consult Constitution
    const consultBtn = document.getElementById('btn-consult-constitution');
    const consultInput = document.getElementById('consult-dilemma-input');
    const consultOut = document.getElementById('consult-result-output');

    if (consultBtn && consultInput && consultOut) {
      consultBtn.addEventListener('click', () => {
        const q = consultInput.value.trim();
        if (!q) {
          alert('Lütfen anayasaya danışmak istediğiniz ikilemi yazın.');
          return;
        }

        consultOut.style.display = 'block';
        consultOut.innerHTML = `
          <div style="padding:1rem; background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.35); border-radius:var(--radius-md);">
            <div style="font-size:0.78rem; font-weight:800; color:#fbbf24; text-transform:uppercase; margin-bottom:0.25rem;">ANAYASA HÜKMÜ</div>
            <strong style="color:var(--text-main); font-size:0.9rem;">"${q}" karşısında:</strong>
            <p style="font-size:0.83rem; color:var(--text-muted); margin-top:0.4rem; line-height:1.5;">
              Temel ilkeniz şunu emreder: <em>"Duygularımla değil, uzun vadeli değerlerimle karar veririm. Ertelemek geleceğimden tefeci faiziyle borç almaktır."</em> Şu anki geçici isteksizlik bir sinyal değil, sadece beynin konfor tuzağıdır. 5 dakikalık kuralı uygulayın ve hemen eyleme geçin.
            </p>
          </div>
        `;
        window.LuminaAudio.playBeep(440, 'triangle', 0.12);
      });
    }

    // Copy Autopsy Report
    const copyReportBtn = document.getElementById('btn-copy-autopsy-report');
    if (copyReportBtn) {
      copyReportBtn.addEventListener('click', () => {
        const text = `Lumina AI - Haftalık Zihinsel Performans Biyopsisi:\n• Tamamlanan Görevler: 14\n• Derin Odak Süresi: 6.5 Saat\n• Kaçınma Deseni: Zor işlerde maillere kaçma\n• Dayanıklılık Notu: A- (Stoacı Kabullenme Yüksek)`;
        navigator.clipboard.writeText(text).then(() => {
          alert('Haftalık Biyopsi Raporu panoya kopyalandı!');
        });
      });
    }
  }

  function renderPrinciplesList() {
    const listEl = document.getElementById('principles-list');
    const badge = document.getElementById('principles-count-tag');
    if (!listEl) return;

    const stored = localStorage.getItem('lumina_codex_principles');
    const principles = stored ? JSON.parse(stored) : defaultPrinciples;

    if (badge) badge.textContent = `${principles.length} İlke`;

    listEl.innerHTML = principles.map((p, i) => `
      <div class="principle-item">
        <span class="principle-num">${i + 1}.</span>
        <span class="principle-text">${p}</span>
      </div>
    `).join('');
  }

  function renderWeeklyAutopsyReport() {
    const sheet = document.getElementById('autopsy-report-sheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
        <div>
          <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main);">Bu Haftanın Zihinsel Röntgeni</h4>
          <span style="font-size:0.78rem; color:var(--text-muted);">Veri Kaynakları: Pomodoro, Görevler, AI Notları ve Zihin İkizi</span>
        </div>
        <span class="badge-tag" style="background:#10b98122; color:#34d399; border:1px solid #10b98144;">Dayanıklılık Skoru: %88 (A-)</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <div style="padding:1rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Zirve Odaklanma Saati</div>
          <strong style="font-size:1.15rem; color:#38bdf8;">09:30 - 11:30 (Sabah)</strong>
        </div>
        <div style="padding:1rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Kaçınma & Erteleme Deseni</div>
          <strong style="font-size:0.95rem; color:#f87171;">Büyük Yazım Görevleri</strong>
        </div>
        <div style="padding:1rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Felsefi Dengelenme</div>
          <strong style="font-size:1.15rem; color:#c084fc;">%82 Stoacı Sükunet</strong>
        </div>
      </div>

      <div style="padding:1rem; background:rgba(99, 102, 241, 0.08); border:1px solid rgba(99, 102, 241, 0.25); border-radius:var(--radius-lg);">
        <strong style="color:var(--text-main); font-size:0.92rem;">💊 Önümüzdeki Hafta İçin Bilişsel Reçete:</strong>
        <p style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; margin-top:0.35rem;">
          Öğleden sonra 14:00 - 15:00 arasında görülen enerji düşüşü için 20 dakikalık NSDR seansını takvime sabitleyin. Erteleme görülen büyük yazım projelerini haftanın başında 3 mikro parçaya bölerek başlayın.
        </p>
      </div>
    `;
  }

  // =========================================================================
  // ATMOSPHERE THEMES ENGINE & FOCUS DEFENSE SHIELD
  // =========================================================================
  function initAtmosphereThemeEngine() {
    const atmoBtn = document.getElementById('btn-atmosphere-picker');
    const modal = document.getElementById('atmosphere-picker-modal');
    const closeBtn = document.getElementById('close-atmosphere-modal');
    const cards = document.querySelectorAll('.atmosphere-card-option');
    const settingSelect = document.getElementById('setting-theme');

    function applyAtmosphereTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('lumina_atmosphere', themeName);
      if (settingSelect) settingSelect.value = themeName;
    }

    // Load saved atmosphere on boot
    const saved = localStorage.getItem('lumina_atmosphere') || 'dark';
    applyAtmosphereTheme(saved);

    if (atmoBtn && modal) {
      atmoBtn.addEventListener('click', () => modal.showModal());
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.close());
    }

    cards.forEach(c => {
      c.addEventListener('click', () => {
        const theme = c.getAttribute('data-theme');
        if (theme) {
          applyAtmosphereTheme(theme);
          window.LuminaAudio.playBeep(520, 'sine', 0.1);
          if (modal) modal.close();
        }
      });
    });

    if (settingSelect) {
      settingSelect.addEventListener('change', (e) => {
        applyAtmosphereTheme(e.target.value);
      });
    }
  }

  function initFocusShield() {
    const shieldBtn = document.getElementById('btn-focus-shield');
    const modal = document.getElementById('focus-shield-modal');
    const closeBtn = document.getElementById('close-shield-modal');
    const deactBtn = document.getElementById('btn-deactivate-shield');
    const reEngageBtn = document.getElementById('btn-re-engage-focus');
    const triggerCards = document.querySelectorAll('.shield-trigger-card');
    const interventionBox = document.getElementById('shield-intervention-box');

    if (!shieldBtn || !modal) return;

    shieldBtn.addEventListener('click', () => {
      // Find active or top task
      const tasks = window.LuminaStorage.getTasks() || [];
      const topTask = tasks.find(t => !t.completed) || { title: 'Derin Zihinsel Odak Seansı' };
      const taskTitleEl = document.getElementById('shield-active-task-title');
      if (taskTitleEl) taskTitleEl.textContent = `🎯 ${topTask.title}`;
      if (interventionBox) interventionBox.style.display = 'none';

      modal.showModal();
      window.LuminaAudio.playBeep(440, 'triangle', 0.15);
    });

    if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
    if (deactBtn) deactBtn.addEventListener('click', () => modal.close());
    if (reEngageBtn) {
      reEngageBtn.addEventListener('click', () => {
        modal.close();
        switchView('focus');
      });
    }

    triggerCards.forEach(card => {
      card.addEventListener('click', () => {
        const trigger = card.getAttribute('data-trigger');
        if (!interventionBox) return;

        interventionBox.style.display = 'block';
        if (trigger === 'too-hard') {
          interventionBox.innerHTML = `
            <strong style="color:#38bdf8;">🧗 Karşı Hamle: 3 Mikro-Parça Kuralı</strong>
            <p style="margin-top:0.35rem; color:var(--text-main);">Görevin tamamını bitirmeyi unut. Şu an sadece ilk 3 dakikada yapılacak tek bir satırı veya başlığı yaz. Momentum direnci yener.</p>
          `;
        } else if (trigger === 'bored') {
          interventionBox.innerHTML = `
            <strong style="color:#f59e0b;">🥱 Karşı Hamle: 5 Dakikalık Hız Sprinti</strong>
            <p style="margin-top:0.35rem; color:var(--text-main);">Kronometreni 5 dakikaya kur ve bitirebildiğin kadar hızlı şekilde taslak çıkar. Sıkıntı sadece beynin ucuz dopamin arayışıdır.</p>
          `;
        } else if (trigger === 'tired') {
          interventionBox.innerHTML = `
            <strong style="color:#10b981;">🔋 Karşı Hamle: 90 Saniyelik Fiziksel Reset</strong>
            <p style="margin-top:0.35rem; color:var(--text-main);">Monitörden bakışlarını çek, bir bardak soğuk su iç ve 3 derin Fizyolojik İçe Çekiş nefesi al.</p>
          `;
        } else {
          interventionBox.innerHTML = `
            <strong style="color:#c084fc;">⚡ Karşı Hamle: Berbat Yapma İzni</strong>
            <p style="margin-top:0.35rem; color:var(--text-main);">Mükemmel olmak zorunda değilsin; ilk taslağın berbat olmasına izin ver. Düzeltmek, boş bir sayfaya bakmaktan her zaman daha kolaydır.</p>
          `;
        }
        window.LuminaAudio.playBeep(580, 'sine', 0.1);
      });
    });
  }

  // --- Initial Render & Dimension Event Wiring ---
  initEmergencySOS();
  initGalaxyEvents();
  initTwinEvents();
  initTrajectoryEvents();
  initLifeOsEvents();
  initChronosEvents();
  initBiohackEvents();
  initSynthesizerEvents();
  initCodexEvents();
  initAtmosphereThemeEngine();
  initFocusShield();

  updateTopbarRPG();
  renderDashboard();
});


