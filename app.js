// ===== Study Timeline App =====

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupItemNotes();
    setupCheckboxListeners();
    setupNavigation();
    updateAllProgress();
    trackStudyDay();
    buildKanban();
});

// ===== State Management =====

const STORAGE_KEY = 'academy-study-progress';
const NOTES_KEY = 'academy-study-notes';
const STREAK_KEY = 'academy-study-days';
const KANBAN_KEY = 'academy-kanban-state';

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const state = JSON.parse(saved);
    document.querySelectorAll('.checklist-item').forEach(item => {
        const id = item.dataset.id;
        if (state[id]) {
            item.querySelector('input[type="checkbox"]').checked = true;
        }
    });
}

function saveState() {
    const state = {};
    document.querySelectorAll('.checklist-item').forEach(item => {
        const id = item.dataset.id;
        state[id] = item.querySelector('input[type="checkbox"]').checked;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ===== Study Day Tracking =====

function trackStudyDay() {
    const today = new Date().toISOString().split('T')[0];
    let days = JSON.parse(localStorage.getItem(STREAK_KEY) || '[]');

    if (!days.includes(today)) {
        days.push(today);
        localStorage.setItem(STREAK_KEY, JSON.stringify(days));
    }

    document.getElementById('statStreak').textContent = days.length;
}

// ===== Checkbox Listeners =====

function setupCheckboxListeners() {
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveState();
            updateAllProgress();

            // Sync with kanban: if checked, remove from "doing"
            const itemId = checkbox.closest('.checklist-item').dataset.id;
            if (checkbox.checked) {
                const kanbanState = getKanbanState();
                delete kanbanState[itemId];
                saveKanbanState(kanbanState);
                trackStudyDay();
                checkForCelebration();
            }

            buildKanban();
        });
    });
}

// ===== Progress Updates =====

function updateAllProgress() {
    updateCategoryProgress('prova', ['raciocinio', 'logica', 'linguagemc', 'oo']);
    updateCategoryProgress('entrevista', ['criatividade']);
    updateCategoryProgress('recursos', ['extras']);
    updateCategoryProgress('ingles', ['ingles-m1', 'ingles-m2', 'ingles-m3']);
    updateCategoryProgress('livro', ['livro']);
    updateGlobalProgress();
    updateStats();
}

function updateCategoryProgress(categoryId, topicIds) {
    let totalItems = 0;
    let checkedItems = 0;

    topicIds.forEach(topicId => {
        const list = document.getElementById(`${topicId}-list`);
        if (!list) return;

        const items = list.querySelectorAll('.checklist-item');
        const checked = list.querySelectorAll('input[type="checkbox"]:checked');

        totalItems += items.length;
        checkedItems += checked.length;

        // Update topic badge
        const badge = document.getElementById(`${topicId}-badge`);
        if (badge) {
            badge.textContent = `${checked.length}/${items.length}`;
            if (checked.length === items.length && items.length > 0) {
                badge.classList.add('complete');
            } else {
                badge.classList.remove('complete');
            }
        }
    });

    const percent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    const progressBar = document.getElementById(`${categoryId}Progress`);
    const percentText = document.getElementById(`${categoryId}Percent`);

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (percentText) percentText.textContent = `${percent}%`;
}

function updateGlobalProgress() {
    const allItems = document.querySelectorAll('.checklist-item');
    const allChecked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');

    const percent = allItems.length > 0 ? Math.round((allChecked.length / allItems.length) * 100) : 0;

    // Update circle progress
    const progressPath = document.getElementById('globalProgressPath');
    const progressText = document.getElementById('globalProgressText');

    if (progressPath) progressPath.setAttribute('stroke-dasharray', `${percent}, 100`);
    if (progressText) progressText.textContent = `${percent}%`;
}

function updateStats() {
    const allItems = document.querySelectorAll('.checklist-item');
    const allChecked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');

    document.getElementById('statCompleted').textContent = allChecked.length;
    document.getElementById('statPending').textContent = allItems.length - allChecked.length;

    // Count completed sections
    const topics = ['raciocinio', 'logica', 'linguagemc', 'oo', 'criatividade', 'extras', 'ingles-m1', 'ingles-m2', 'ingles-m3', 'livro'];
    let completedSections = 0;

    topics.forEach(topicId => {
        const list = document.getElementById(`${topicId}-list`);
        if (!list) return;

        const items = list.querySelectorAll('.checklist-item');
        const checked = list.querySelectorAll('input[type="checkbox"]:checked');

        if (items.length > 0 && checked.length === items.length) {
            completedSections++;
        }
    });

    document.getElementById('statSections').textContent = `${completedSections}/${topics.length}`;
}

// ===== Topic Toggle =====

function toggleTopic(headerEl) {
    const card = headerEl.closest('.topic-card');
    card.classList.toggle('open');
}

// ===== Navigation =====

function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const section = btn.dataset.section;
            filterSections(section);
        });
    });
}

function filterSections(filter) {
    const categorySections = document.querySelectorAll('.category-section');
    const roadmapSection = document.querySelector('.roadmap-section');
    const kanbanSection = document.querySelector('.kanban-section');

    categorySections.forEach(section => {
        if (filter === 'all') {
            section.classList.remove('hidden');
        } else {
            const category = section.dataset.category;
            section.classList.toggle('hidden', category !== filter);
        }
    });

    // Show/hide roadmap
    if (roadmapSection) {
        if (filter === 'all' || filter === 'roadmap') {
            roadmapSection.classList.remove('hidden');
        } else {
            roadmapSection.classList.add('hidden');
        }
    }

    // Show/hide kanban
    if (kanbanSection) {
        if (filter === 'kanban') {
            kanbanSection.classList.remove('hidden');
            buildKanban();
        } else {
            kanbanSection.classList.add('hidden');
        }
    }

    // Also show/hide stats, backup
    const statsGrid = document.querySelector('.stats-grid');
    const backupSection = document.querySelector('.backup-section');

    if (filter === 'all') {
        statsGrid.classList.remove('hidden');
        if (backupSection) backupSection.classList.remove('hidden');
    } else {
        statsGrid.classList.add('hidden');
        if (backupSection) backupSection.classList.add('hidden');
    }
}

// ===== Item Notes =====

const ITEM_NOTES_KEY = 'academy-item-notes';

function getItemNotes() {
    return JSON.parse(localStorage.getItem(ITEM_NOTES_KEY) || '{}');
}

function saveItemNotes(notes) {
    localStorage.setItem(ITEM_NOTES_KEY, JSON.stringify(notes));
}

function setupItemNotes() {
    const notes = getItemNotes();

    document.querySelectorAll('.checklist-item').forEach(item => {
        const id = item.dataset.id;

        // Wrap existing content in a row div
        const row = document.createElement('div');
        row.className = 'checklist-item-row';
        while (item.firstChild) {
            row.appendChild(item.firstChild);
        }
        item.appendChild(row);

        // Add note toggle button
        const noteBtn = document.createElement('button');
        noteBtn.className = 'note-toggle' + (notes[id] ? ' has-note' : '');
        noteBtn.title = 'Anotação';
        noteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
        noteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const noteArea = item.querySelector('.note-area');
            noteArea.classList.toggle('open');
            if (noteArea.classList.contains('open')) {
                noteArea.querySelector('textarea').focus();
            }
        });
        row.appendChild(noteBtn);

        // Add note area
        const noteArea = document.createElement('div');
        noteArea.className = 'note-area';
        noteArea.innerHTML = `
            <textarea placeholder="Escreva sua anotação sobre esta aula...">${notes[id] || ''}</textarea>
            <div class="note-meta">
                <span class="note-saved">Salvo!</span>
                <span class="note-char-count">${(notes[id] || '').length} caracteres</span>
            </div>
        `;
        item.appendChild(noteArea);

        // Auto-save on input
        const textarea = noteArea.querySelector('textarea');
        const savedLabel = noteArea.querySelector('.note-saved');
        const charCount = noteArea.querySelector('.note-char-count');
        let saveTimeout;

        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            charCount.textContent = `${textarea.value.length} caracteres`;

            saveTimeout = setTimeout(() => {
                const allNotes = getItemNotes();
                if (textarea.value.trim()) {
                    allNotes[id] = textarea.value;
                    noteBtn.classList.add('has-note');
                } else {
                    delete allNotes[id];
                    noteBtn.classList.remove('has-note');
                }
                saveItemNotes(allNotes);

                savedLabel.classList.add('visible');
                setTimeout(() => savedLabel.classList.remove('visible'), 1500);
            }, 400);
        });
    });
}

// ===== Celebration =====

function checkForCelebration() {
    const allItems = document.querySelectorAll('.checklist-item');
    const allChecked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');

    // Celebrate at 25%, 50%, 75%, 100%
    const percent = Math.round((allChecked.length / allItems.length) * 100);
    const milestones = [25, 50, 75, 100];

    const prevChecked = allChecked.length - 1;
    const prevPercent = Math.round((prevChecked / allItems.length) * 100);

    for (const milestone of milestones) {
        if (percent >= milestone && prevPercent < milestone) {
            showCelebration(milestone);
            break;
        }
    }

    // Also celebrate completing a topic
    const topics = ['raciocinio', 'logica', 'linguagemc', 'oo', 'criatividade', 'extras', 'ingles-m1', 'ingles-m2', 'ingles-m3', 'livro'];
    topics.forEach(topicId => {
        const list = document.getElementById(`${topicId}-list`);
        if (!list) return;

        const items = list.querySelectorAll('.checklist-item');
        const checked = list.querySelectorAll('input[type="checkbox"]:checked');

        if (items.length > 0 && checked.length === items.length) {
            const wasJustCompleted = Array.from(items).some(item => {
                const cb = item.querySelector('input[type="checkbox"]');
                return cb === document.activeElement || cb === lastCheckedBox;
            });
        }
    });
}

let lastCheckedBox = null;
document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') lastCheckedBox = e.target;
});

function showCelebration(milestone) {
    // Create confetti
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff3b30', '#ff9500', '#34c759', '#0071e3', '#af52de', '#ff2d55'];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 100,
            w: 6 + Math.random() * 6,
            h: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 2 + Math.random() * 4,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2
        });
    }

    let frame = 0;
    const maxFrames = 120;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin;
        });

        frame++;
        if (frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    animate();

    // Show message
    const messages = {
        25: 'Ótimo começo! 25% concluído!',
        50: 'Metade do caminho! Continue assim!',
        75: 'Quase lá! 75% concluído!',
        100: 'Parabéns! Todos os tópicos concluídos!'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: var(--bg-card, #fff);
        color: var(--text-primary, #1d1d1f);
        padding: 24px 36px;
        border-radius: 20px;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Inter', sans-serif;
    `;
    toast.textContent = messages[milestone];
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ===== Backup / Export / Import =====

function exportData() {
    const data = {
        version: 2,
        exportDate: new Date().toISOString(),
        progress: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
        notes: localStorage.getItem(NOTES_KEY) || '',
        itemNotes: JSON.parse(localStorage.getItem(ITEM_NOTES_KEY) || '{}'),
        studyDays: JSON.parse(localStorage.getItem(STREAK_KEY) || '[]'),
        kanban: JSON.parse(localStorage.getItem(KANBAN_KEY) || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (!data.progress) {
                alert('Arquivo inválido. Selecione um backup válido.');
                return;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
            if (data.notes) localStorage.setItem(NOTES_KEY, data.notes);
            if (data.itemNotes) localStorage.setItem(ITEM_NOTES_KEY, JSON.stringify(data.itemNotes));
            if (data.studyDays) localStorage.setItem(STREAK_KEY, JSON.stringify(data.studyDays));
            if (data.kanban) localStorage.setItem(KANBAN_KEY, JSON.stringify(data.kanban));

            location.reload();
        } catch (err) {
            alert('Erro ao ler o arquivo. Verifique se é um backup válido.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetData() {
    if (!confirm('Tem certeza que deseja apagar todo o progresso? Essa ação não pode ser desfeita.')) return;
    if (!confirm('ÚLTIMA CHANCE: Todos os dados serão apagados. Continuar?')) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(ITEM_NOTES_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(KANBAN_KEY);
    location.reload();
}

// ===== Kanban Board =====

const TOPIC_LABELS = {
    logica: 'Lógica de Programação',
    linguagemc: 'Linguagem C',
    raciocinio: 'Raciocínio Lógico',
    oo: 'Orientação a Objetos',
    criatividade: 'Entrevista',
    extras: 'Extras',
    'ingles-m1': 'Inglês — Módulo 1 (Básico)',
    'ingles-m2': 'Inglês — Módulo 2 (Intermediário)',
    'ingles-m3': 'Inglês — Módulo 3 (Avançado)',
    livro: 'Entendendo Algoritmos'
};

function getKanbanState() {
    return JSON.parse(localStorage.getItem(KANBAN_KEY) || '{}');
}

function saveKanbanState(state) {
    localStorage.setItem(KANBAN_KEY, JSON.stringify(state));
}

function buildKanban() {
    const board = document.getElementById('kanban-board');
    if (!board) return;

    board.innerHTML = '';

    const kanbanState = getKanbanState();
    const checkboxState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    // Collect all items grouped by topic
    const topicData = {};

    document.querySelectorAll('.topic-card').forEach(card => {
        const topic = card.dataset.topic;
        if (!topic) return;
        const step = parseInt(card.dataset.step || '0');

        if (!topicData[topic]) {
            topicData[topic] = { step, todo: [], doing: [], done: [] };
        }

        card.querySelectorAll('.checklist-item').forEach(item => {
            const id = item.dataset.id;
            const text = item.querySelector('.item-text').textContent;
            const isChecked = checkboxState[id] || false;

            let status = 'todo';
            if (isChecked) {
                status = 'done';
            } else if (kanbanState[id] === 'doing') {
                status = 'doing';
            }

            topicData[topic][status].push({ id, text });
        });
    });

    // Sort topics by step, then render
    const sortedTopics = Object.entries(topicData).sort((a, b) => a[1].step - b[1].step);

    sortedTopics.forEach(([topic, data]) => {
        const total = data.todo.length + data.doing.length + data.done.length;
        if (total === 0) return;

        const percent = Math.round((data.done.length / total) * 100);
        const label = TOPIC_LABELS[topic] || topic;

        const card = document.createElement('div');
        card.className = 'kb-card';

        card.innerHTML = `
            <div class="kb-header" onclick="this.parentElement.classList.toggle('open')">
                <div class="kb-header-left">
                    <span class="kb-color-dot kb-dot-${topic}"></span>
                    <span class="kb-title">${label}</span>
                </div>
                <div class="kb-header-right">
                    <div class="kb-mini-progress">
                        <div class="kb-mini-progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <span class="kb-stats">${data.done.length}/${total}</span>
                    <svg class="kb-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </div>
            <div class="kb-body">
                <div class="kb-columns">
                    <div class="kb-col">
                        <div class="kb-col-header col-todo">A Fazer <span class="kb-col-count">${data.todo.length}</span></div>
                        <div class="kb-col-items" id="kb-todo-${topic}"></div>
                    </div>
                    <div class="kb-col">
                        <div class="kb-col-header col-doing">Estudando <span class="kb-col-count">${data.doing.length}</span></div>
                        <div class="kb-col-items" id="kb-doing-${topic}"></div>
                    </div>
                    <div class="kb-col">
                        <div class="kb-col-header col-done">Concluído <span class="kb-col-count">${data.done.length}</span></div>
                        <div class="kb-col-items" id="kb-done-${topic}"></div>
                    </div>
                </div>
            </div>
        `;

        board.appendChild(card);

        // Populate columns
        const todoCol = card.querySelector(`#kb-todo-${topic}`);
        const doingCol = card.querySelector(`#kb-doing-${topic}`);
        const doneCol = card.querySelector(`#kb-done-${topic}`);

        renderKbItems(todoCol, data.todo, 'todo');
        renderKbItems(doingCol, data.doing, 'doing');
        renderKbItems(doneCol, data.done, 'done');
    });
}

function renderKbItems(container, items, status) {
    if (items.length === 0) {
        container.innerHTML = '<div class="kb-empty">Nenhum item</div>';
        return;
    }

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = `kb-item${status === 'done' ? ' done-item' : ''}`;

        let btns = '';
        if (status === 'todo') {
            btns = `
                <button class="kb-btn" onclick="moveKanban('${item.id}','doing')" title="Estudando">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="kb-btn kb-btn-done" onclick="moveKanban('${item.id}','done')" title="Concluído">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </button>`;
        } else if (status === 'doing') {
            btns = `
                <button class="kb-btn kb-btn-undo" onclick="moveKanban('${item.id}','todo')" title="Voltar">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button class="kb-btn kb-btn-done" onclick="moveKanban('${item.id}','done')" title="Concluído">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </button>`;
        } else {
            btns = `
                <button class="kb-btn kb-btn-undo" onclick="moveKanban('${item.id}','todo')" title="Desfazer">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                </button>`;
        }

        el.innerHTML = `<span class="kb-item-text">${item.text}</span><div class="kb-item-actions">${btns}</div>`;
        container.appendChild(el);
    });
}

function moveKanban(itemId, targetStatus) {
    const kanbanState = getKanbanState();
    const checkboxState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    if (targetStatus === 'done') {
        checkboxState[itemId] = true;
        delete kanbanState[itemId];
    } else if (targetStatus === 'doing') {
        checkboxState[itemId] = false;
        kanbanState[itemId] = 'doing';
    } else {
        checkboxState[itemId] = false;
        delete kanbanState[itemId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkboxState));
    saveKanbanState(kanbanState);

    // Sync checkboxes in the checklist view
    const checkbox = document.querySelector(`.checklist-item[data-id="${itemId}"] input[type="checkbox"]`);
    if (checkbox) {
        checkbox.checked = (targetStatus === 'done');
    }

    updateAllProgress();
    buildKanban();
}
