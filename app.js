// ===== Study Timeline App =====

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupCheckboxListeners();
    setupNavigation();
    setupNotes();
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
    const topics = ['raciocinio', 'logica', 'linguagemc', 'oo', 'criatividade', 'extras'];
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

    // Also show/hide stats, notes, backup
    const statsGrid = document.querySelector('.stats-grid');
    const notesSection = document.querySelector('.notes-section');
    const backupSection = document.querySelector('.backup-section');

    if (filter === 'all') {
        statsGrid.classList.remove('hidden');
        notesSection.classList.remove('hidden');
        if (backupSection) backupSection.classList.remove('hidden');
    } else {
        statsGrid.classList.add('hidden');
        notesSection.classList.add('hidden');
        if (backupSection) backupSection.classList.add('hidden');
    }
}

// ===== Notes =====

function setupNotes() {
    const textarea = document.getElementById('notesArea');
    const saved = localStorage.getItem(NOTES_KEY);

    if (saved) textarea.value = saved;

    let saveTimeout;
    textarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem(NOTES_KEY, textarea.value);
        }, 500);
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
    const topics = ['raciocinio', 'logica', 'linguagemc', 'oo', 'criatividade', 'extras'];
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
        25: 'Otimo comeco! 25% concluido!',
        50: 'Metade do caminho! Continue assim!',
        75: 'Quase la! 75% concluido!',
        100: 'Parabens! Todos os topicos concluidos!'
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
        version: 1,
        exportDate: new Date().toISOString(),
        progress: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
        notes: localStorage.getItem(NOTES_KEY) || '',
        studyDays: JSON.parse(localStorage.getItem(STREAK_KEY) || '[]')
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
                alert('Arquivo invalido. Selecione um backup valido.');
                return;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
            if (data.notes) localStorage.setItem(NOTES_KEY, data.notes);
            if (data.studyDays) localStorage.setItem(STREAK_KEY, JSON.stringify(data.studyDays));

            location.reload();
        } catch (err) {
            alert('Erro ao ler o arquivo. Verifique se e um backup valido.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetData() {
    if (!confirm('Tem certeza que deseja apagar todo o progresso? Essa acao nao pode ser desfeita.')) return;
    if (!confirm('ULTIMA CHANCE: Todos os dados serao apagados. Continuar?')) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(KANBAN_KEY);
    location.reload();
}

// ===== Kanban Board =====

const TOPIC_LABELS = {
    logica: 'Logica de Programacao',
    linguagemc: 'Linguagem C',
    raciocinio: 'Raciocinio Logico',
    oo: 'Orientacao a Objetos',
    criatividade: 'Entrevista',
    extras: 'Extras'
};

function getKanbanState() {
    return JSON.parse(localStorage.getItem(KANBAN_KEY) || '{}');
}

function saveKanbanState(state) {
    localStorage.setItem(KANBAN_KEY, JSON.stringify(state));
}

function buildKanban() {
    const todoCol = document.getElementById('kanban-todo');
    const doingCol = document.getElementById('kanban-doing');
    const doneCol = document.getElementById('kanban-done');

    if (!todoCol || !doingCol || !doneCol) return;

    todoCol.innerHTML = '';
    doingCol.innerHTML = '';
    doneCol.innerHTML = '';

    const kanbanState = getKanbanState();
    const checkboxState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    // Collect all items from all checklists
    const allItems = [];
    document.querySelectorAll('.topic-card').forEach(card => {
        const topic = card.dataset.topic;
        if (!topic) return;
        const step = card.dataset.step || '0';

        card.querySelectorAll('.checklist-item').forEach(item => {
            const id = item.dataset.id;
            const text = item.querySelector('.item-text').textContent;
            const priorityEl = item.querySelector('.priority');
            const priority = priorityEl ? priorityEl.textContent : '';
            const priorityClass = priorityEl ? priorityEl.className.replace('priority ', '') : '';
            const isChecked = checkboxState[id] || false;

            // Determine kanban status
            let status = 'todo';
            if (isChecked) {
                status = 'done';
            } else if (kanbanState[id] === 'doing') {
                status = 'doing';
            }

            allItems.push({ id, text, topic, step, priority, priorityClass, status });
        });
    });

    // Sort by step number
    allItems.sort((a, b) => parseInt(a.step) - parseInt(b.step));

    let todoCount = 0, doingCount = 0, doneCount = 0;

    allItems.forEach(item => {
        const card = createKanbanCard(item);

        if (item.status === 'done') {
            doneCol.appendChild(card);
            doneCount++;
        } else if (item.status === 'doing') {
            doingCol.appendChild(card);
            doingCount++;
        } else {
            todoCol.appendChild(card);
            todoCount++;
        }
    });

    document.getElementById('kanban-todo-count').textContent = todoCount;
    document.getElementById('kanban-doing-count').textContent = doingCount;
    document.getElementById('kanban-done-count').textContent = doneCount;
}

function createKanbanCard(item) {
    const card = document.createElement('div');
    card.className = `kanban-card${item.status === 'done' ? ' done-card' : ''}`;
    card.dataset.id = item.id;

    const topicLabel = TOPIC_LABELS[item.topic] || item.topic;

    let buttonsHTML = '';

    if (item.status === 'todo') {
        buttonsHTML = `
            <button class="kanban-card-btn" onclick="moveKanban('${item.id}', 'doing')" title="Mover para Estudando">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <button class="kanban-card-btn btn-done" onclick="moveKanban('${item.id}', 'done')" title="Marcar como concluido">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
        `;
    } else if (item.status === 'doing') {
        buttonsHTML = `
            <button class="kanban-card-btn" onclick="moveKanban('${item.id}', 'todo')" title="Voltar para A Fazer">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="kanban-card-btn btn-done" onclick="moveKanban('${item.id}', 'done')" title="Marcar como concluido">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
        `;
    } else {
        buttonsHTML = `
            <button class="kanban-card-btn" onclick="moveKanban('${item.id}', 'todo')" title="Voltar para A Fazer">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>
        `;
    }

    card.innerHTML = `
        <div class="kanban-card-title">${item.text}</div>
        <div class="kanban-card-footer">
            <span class="kanban-card-topic topic-${item.topic}">${topicLabel}</span>
            <div class="kanban-card-actions">${buttonsHTML}</div>
        </div>
    `;

    return card;
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
