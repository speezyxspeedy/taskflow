/**
 * TaskFlow — Smart To-Do List
 * Day 4 of 365 Days Coding Challenge
 * Vanilla JavaScript Implementation
 */

// --- Application State ---
const STORAGE_KEY_TASKS = 'taskflow_tasks';
const STORAGE_KEY_THEME = 'taskflow_theme';

let tasks = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'
let searchQuery = '';

// --- DOM Element References ---
const elements = {
  // Theme & Date
  currentDateText: document.getElementById('current-date-text'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),

  // Progress
  progressPercent: document.getElementById('progress-percent'),
  progressText: document.getElementById('progress-text'),
  progressMotivation: document.getElementById('progress-motivation'),
  progressBarFill: document.getElementById('progress-bar-fill'),

  // Stats
  statTotalValue: document.getElementById('stat-total-value'),
  statCompletedValue: document.getElementById('stat-completed-value'),
  statActiveValue: document.getElementById('stat-active-value'),
  statHighValue: document.getElementById('stat-high-value'),

  // Add Task Form
  addTaskForm: document.getElementById('add-task-form'),
  taskTitleInput: document.getElementById('task-title-input'),
  taskPrioritySelect: document.getElementById('task-priority-select'),
  taskDueDateInput: document.getElementById('task-due-date-input'),

  // Filters & Search
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  countAll: document.getElementById('count-all'),
  countActive: document.getElementById('count-active'),
  countCompleted: document.getElementById('count-completed'),

  // Task List & Empty States
  taskList: document.getElementById('task-list'),
  emptyStateAll: document.getElementById('empty-state-all'),
  emptyStateFilter: document.getElementById('empty-state-filter'),

  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

// --- Initial Starter Data ---
const DEFAULT_TASKS = [
  {
    id: 'demo-1',
    title: 'Review Day 4 challenge goals & wireframes',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true
  },
  {
    id: 'demo-2',
    title: 'Build clean SaaS dashboard UI for TaskFlow',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true
  },
  {
    id: 'demo-3',
    title: 'Implement localStorage persistence & toast notifications',
    priority: 'medium',
    dueDate: getRelativeDateString(1),
    completed: false
  },
  {
    id: 'demo-4',
    title: 'Share Day 4 build update on LinkedIn and X',
    priority: 'low',
    dueDate: getRelativeDateString(2),
    completed: false
  }
];

// Helper to get formatted date string offset from today
function getRelativeDateString(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// ==========================================================================
// Initialization
// ==========================================================================

function initApp() {
  initTheme();
  renderCurrentDate();
  loadTasks();
  attachEventListeners();
  setDefaultDueDate();
  updateStats();
  updateProgress();
  renderTasks();
}

function setDefaultDueDate() {
  if (elements.taskDueDateInput) {
    elements.taskDueDateInput.value = new Date().toISOString().split('T')[0];
  }
}

function renderCurrentDate() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  elements.currentDateText.textContent = now.toLocaleDateString('en-US', options);
}

// ==========================================================================
// Theme Management
// ==========================================================================

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info');
}

// ==========================================================================
// Local Storage & Task State
// ==========================================================================

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY_TASKS);
  if (stored !== null) {
    try {
      tasks = JSON.parse(stored);
      if (!Array.isArray(tasks)) tasks = [];
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
      tasks = [];
    }
  } else {
    // First time visitor: seed default starter tasks
    tasks = [...DEFAULT_TASKS];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
}

// ==========================================================================
// Task CRUD Operations
// ==========================================================================

function addTask(title, priority = 'medium', dueDate = '') {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    showToast('Task title cannot be empty.', 'delete');
    return false;
  }

  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title: trimmedTitle,
    priority: priority.toLowerCase(),
    dueDate: dueDate || '',
    completed: false
  };

  // Prepend new task so it appears at top
  tasks.unshift(newTask);
  saveTasks();
  updateStats();
  updateProgress();
  renderTasks();
  showToast('Task added successfully.', 'success');
  return true;
}

function toggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  updateStats();
  updateProgress();
  renderTasks();

  if (task.completed) {
    showToast('Task completed.', 'success');
  } else {
    showToast('Task marked as active.', 'info');
  }
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.classList.add('removing');
    setTimeout(() => {
      tasks.splice(taskIndex, 1);
      saveTasks();
      updateStats();
      updateProgress();
      renderTasks();
      showToast('Task deleted.', 'delete');
    }, 240);
  } else {
    tasks.splice(taskIndex, 1);
    saveTasks();
    updateStats();
    updateProgress();
    renderTasks();
    showToast('Task deleted.', 'delete');
  }
}

// ==========================================================================
// Filtering & Real-time Search
// ==========================================================================

function filterTasks(filterType) {
  currentFilter = filterType;
  elements.filterButtons.forEach(btn => {
    const isActive = btn.dataset.filter === filterType;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  renderTasks();
}

function searchTasks(query) {
  searchQuery = query.trim().toLowerCase();
  elements.clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
  renderTasks();
}

function getFilteredTasks() {
  return tasks.filter(task => {
    // 1. Status Filter
    let matchesStatus = true;
    if (currentFilter === 'active') {
      matchesStatus = !task.completed;
    } else if (currentFilter === 'completed') {
      matchesStatus = task.completed;
    }

    // 2. Search Query Filter
    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = task.title.toLowerCase().includes(searchQuery);
    }

    return matchesStatus && matchesSearch;
  });
}

// ==========================================================================
// Rendering
// ==========================================================================

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  elements.taskList.innerHTML = '';

  // Handle Empty States
  if (tasks.length === 0) {
    elements.emptyStateAll.classList.remove('hidden');
    elements.emptyStateFilter.classList.add('hidden');
    return;
  } else {
    elements.emptyStateAll.classList.add('hidden');
  }

  if (filteredTasks.length === 0) {
    elements.emptyStateFilter.classList.remove('hidden');
    return;
  } else {
    elements.emptyStateFilter.classList.add('hidden');
  }

  // Render cards
  filteredTasks.forEach(task => {
    const taskEl = createTaskElement(task);
    elements.taskList.appendChild(taskEl);
  });
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.setAttribute('data-task-id', task.id);

  // Due Date Badge calculation
  let dueDateBadgeHtml = '';
  if (task.dueDate) {
    const { formattedDate, statusClass } = computeDueDateBadge(task.dueDate);
    dueDateBadgeHtml = `
      <span class="badge-due-date ${statusClass}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${escapeHtml(formattedDate)}
      </span>
    `;
  }

  // Priority Badge
  const priorityClass = `badge-${task.priority}`;
  const priorityHtml = `
    <span class="badge-priority ${priorityClass}">
      <span class="badge-priority-dot" aria-hidden="true"></span>
      ${escapeHtml(task.priority)}
    </span>
  `;

  li.innerHTML = `
    <div class="task-item-left">
      <label class="custom-checkbox" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
        <input 
          type="checkbox" 
          ${task.completed ? 'checked' : ''} 
          aria-label="Toggle task: ${escapeHtml(task.title)}"
        >
        <span class="checkbox-box">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </label>

      <div class="task-content">
        <span class="task-title">${escapeHtml(task.title)}</span>
        <div class="task-meta-tags">
          ${priorityHtml}
          ${dueDateBadgeHtml}
        </div>
      </div>
    </div>

    <div class="task-item-actions">
      <button class="btn-action btn-delete" aria-label="Delete task: ${escapeHtml(task.title)}" title="Delete task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `;

  // Attach Item Event Listeners
  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const deleteBtn = li.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  return li;
}

function computeDueDateBadge(dateString) {
  // Input: 'YYYY-MM-DD'
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[month - 1]} ${day}`;

  if (diffDays < 0) {
    return { formattedDate: `Overdue (${formattedDate})`, statusClass: 'overdue' };
  } else if (diffDays === 0) {
    return { formattedDate: `Today`, statusClass: 'today' };
  } else if (diffDays === 1) {
    return { formattedDate: `Tomorrow`, statusClass: 'normal' };
  } else {
    return { formattedDate: formattedDate, statusClass: 'normal' };
  }
}

// ==========================================================================
// Statistics & Progress Updates
// ==========================================================================

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  // Counter values
  elements.statTotalValue.textContent = total;
  elements.statCompletedValue.textContent = completed;
  elements.statActiveValue.textContent = active;
  elements.statHighValue.textContent = highPriority;

  // Filter badge counts
  elements.countAll.textContent = total;
  elements.countActive.textContent = active;
  elements.countCompleted.textContent = completed;
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Text values
  elements.progressText.textContent = `${completed} / ${total} Tasks Completed`;
  elements.progressPercent.textContent = `${percent}%`;

  // Bar width
  elements.progressBarFill.style.width = `${percent}%`;
  elements.progressBarFill.parentElement.setAttribute('aria-valuenow', percent);

  // Motivational caption
  let motivation = 'Ready to tackle your day!';
  if (total === 0) {
    motivation = 'Start by adding your first task!';
  } else if (percent === 100) {
    motivation = 'All tasks completed! Fantastic job! 🎉';
  } else if (percent >= 75) {
    motivation = 'Almost finished, keep up the great momentum! 🚀';
  } else if (percent >= 50) {
    motivation = 'Halfway there! Keep going strong. ✨';
  } else if (percent > 0) {
    motivation = 'Great start! One step at a time. 💪';
  }
  elements.progressMotivation.textContent = motivation;
}

// ==========================================================================
// Toast Notification System
// ==========================================================================

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  } else if (type === 'delete') {
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  } else {
    // Info
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true">
      ${iconSvg}
    </div>
    <div class="toast-content">${escapeHtml(message)}</div>
  `;

  elements.toastContainer.appendChild(toast);

  // Auto-dismiss after 3000ms
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 250);
  }, 2800);
}

// ==========================================================================
// Event Listeners
// ==========================================================================

function attachEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Form Submit (Add Task)
  elements.addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = elements.taskTitleInput.value;
    const priority = elements.taskPrioritySelect.value;
    const dueDate = elements.taskDueDateInput.value;

    const success = addTask(title, priority, dueDate);
    if (success) {
      elements.taskTitleInput.value = '';
      setDefaultDueDate();
      elements.taskTitleInput.focus();
    }
  });

  // Filter Buttons
  elements.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTasks(btn.dataset.filter);
    });
  });

  // Search Input (Real-time)
  elements.searchInput.addEventListener('input', (e) => {
    searchTasks(e.target.value);
  });

  // Clear Search Button
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchTasks('');
    elements.searchInput.focus();
  });

  // Keyboard shortcut to clear search on Escape
  elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      elements.searchInput.value = '';
      searchTasks('');
    }
  });
}

// Utility: HTML Escaping to prevent XSS
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- App Launch ---
document.addEventListener('DOMContentLoaded', initApp);
