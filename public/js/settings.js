/**
 * settings.js — Ar Finance Manager
 * Gère les paramètres : catégories, préférences, données
 */

// ─── Données initiales ───────────────────────────────────────────────────────
let categories = [
    { id: 1, name: 'Logement',      color: '#4a7cff', subcategories: ['Loyer', 'Charges (eau, électricité, gaz)', 'Internet'] },
    { id: 2, name: 'Transport',     color: '#22c55e', subcategories: ['Essence', 'Transports en commun', 'Entretien véhicule', 'Assurance auto'] },
    { id: 3, name: 'Alimentation',  color: '#a855f7', subcategories: ['Courses', 'Restaurants'] },
    { id: 4, name: 'Loisirs',       color: '#f59e0b', subcategories: ['Cinéma', 'Sports', 'Voyages'] },
    { id: 5, name: 'Santé',         color: '#6b7280', subcategories: ['Médecin', 'Pharmacie'] },
    { id: 6, name: 'Dette',         color: '#ef4444', subcategories: ['Crédit'] },
    { id: 7, name: 'Autre',         color: '#9ca3af', subcategories: [] }
];

let currentCategoryId = 1;
let nextId = 8;
let selectedColor = '#4a7cff';

// ─── Persistance ─────────────────────────────────────────────────────────────
function loadData() {
    const saved = localStorage.getItem('financeCategories');
    if (saved) {
        try {
            categories = JSON.parse(saved);
            const savedId = localStorage.getItem('financeNextId');
            if (savedId) nextId = parseInt(savedId);
        } catch(e) {}
    }
}

function saveData() {
    localStorage.setItem('financeCategories', JSON.stringify(categories));
    localStorage.setItem('financeNextId', nextId.toString());
}

// ─── Onglets ──────────────────────────────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const tabId = 'tab-' + tab.dataset.tab;
            const content = document.getElementById(tabId);
            if (content) content.classList.add('active');
        });
    });
}

// ─── Rendu de la liste des catégories ────────────────────────────────────────
function renderCategoriesList() {
    const container = document.getElementById('categories-items');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <div class="category-item ${cat.id === currentCategoryId ? 'active' : ''}" 
             data-id="${cat.id}" onclick="selectCategoryById(${cat.id})">
            <div class="category-dot" style="background-color: ${cat.color};"></div>
            <div class="category-info">
                <div class="category-name">${cat.name}</div>
                <div class="category-sub">${cat.subcategories.length} sous-cat.</div>
            </div>
            <span class="category-arrow">›</span>
        </div>
    `).join('');
}

// ─── Rendu du panneau d'édition ───────────────────────────────────────────────
function renderEditPanel() {
    const cat = categories.find(c => c.id === currentCategoryId);
    if (!cat) return;

    const nameInput = document.getElementById('cat-name-input');
    if (nameInput) nameInput.value = cat.name;

    selectedColor = cat.color;

    // Couleurs
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.color === cat.color) opt.classList.add('active');
    });

    // Sous-catégories
    renderSubcategories(cat);
}

function renderSubcategories(cat) {
    const list = document.getElementById('subcategories-list');
    if (!list) return;

    if (cat.subcategories.length === 0) {
        list.innerHTML = '<p style="color:#a0a0a0;font-size:13px;padding:12px 0">Aucune sous-catégorie</p>';
        return;
    }

    list.innerHTML = cat.subcategories.map((sub, idx) => `
        <div class="sub-item">
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="color:#6ba0ff;">•</span>
                <span id="sub-text-${idx}">${sub}</span>
            </div>
            <div>
                <button onclick="editSubcat(${idx})" style="background:none;border:none;color:#6ba0ff;margin-right:8px;cursor:pointer;">Modifier</button>
                <button onclick="deleteSubcat(${idx})" style="background:none;border:none;color:#ff6b6b;cursor:pointer;">✕</button>
            </div>
        </div>
    `).join('');
}

// ─── Sélection catégorie ──────────────────────────────────────────────────────
function selectCategoryById(id) {
    currentCategoryId = id;
    renderCategoriesList();
    renderEditPanel();
}

// ─── Actions couleur ──────────────────────────────────────────────────────────
function initColorPicker() {
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedColor = opt.dataset.color;
        });
    });
}

// ─── Sous-catégories ─────────────────────────────────────────────────────────
function editSubcat(idx) {
    const cat = categories.find(c => c.id === currentCategoryId);
    if (!cat) return;
    const newName = prompt('Modifier la sous-catégorie :', cat.subcategories[idx]);
    if (newName && newName.trim()) {
        cat.subcategories[idx] = newName.trim();
        saveData();
        renderSubcategories(cat);
        renderCategoriesList();
    }
}

function deleteSubcat(idx) {
    const cat = categories.find(c => c.id === currentCategoryId);
    if (!cat) return;
    if (confirm('Supprimer cette sous-catégorie ?')) {
        cat.subcategories.splice(idx, 1);
        saveData();
        renderSubcategories(cat);
        renderCategoriesList();
    }
}

// ─── Boutons principaux ───────────────────────────────────────────────────────
function initButtons() {
    // Nouvelle catégorie
    const btnNew = document.getElementById('btn-new-cat');
    if (btnNew) {
        btnNew.addEventListener('click', () => {
            const name = prompt('Nom de la nouvelle catégorie :');
            if (!name || !name.trim()) return;
            const newCat = { id: nextId++, name: name.trim(), color: '#6ba0ff', subcategories: [] };
            categories.push(newCat);
            currentCategoryId = newCat.id;
            saveData();
            renderCategoriesList();
            renderEditPanel();
        });
    }

    // Nouvelle sous-catégorie
    const btnNewSub = document.getElementById('btn-new-subcat');
    if (btnNewSub) {
        btnNewSub.addEventListener('click', () => {
            const cat = categories.find(c => c.id === currentCategoryId);
            if (!cat) return;
            const name = prompt('Nom de la nouvelle sous-catégorie :');
            if (!name || !name.trim()) return;
            cat.subcategories.push(name.trim());
            saveData();
            renderSubcategories(cat);
            renderCategoriesList();
        });
    }

    // Enregistrer catégorie
    const btnSave = document.getElementById('btn-save-cat');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            const cat = categories.find(c => c.id === currentCategoryId);
            if (!cat) return;
            const nameInput = document.getElementById('cat-name-input');
            cat.name  = nameInput ? nameInput.value.trim() || cat.name : cat.name;
            cat.color = selectedColor;
            saveData();
            renderCategoriesList();
            showToast('Catégorie enregistrée ✓');
        });
    }

    // Supprimer catégorie
    const btnDelete = document.getElementById('btn-delete-cat');
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            if (categories.length <= 1) { showToast('Impossible de supprimer la dernière catégorie'); return; }
            if (!confirm('Supprimer cette catégorie ?')) return;
            categories = categories.filter(c => c.id !== currentCategoryId);
            currentCategoryId = categories[0]?.id || null;
            saveData();
            renderCategoriesList();
            if (currentCategoryId) renderEditPanel();
        });
    }


    // Exporter données
    const btnExport = document.getElementById('btn-export');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            const data = {
                transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
                depenses:     JSON.parse(localStorage.getItem('depenses')     || '[]'),
                goals:        JSON.parse(localStorage.getItem('goals')        || '[]'),
                categories
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = 'arfinance_export.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Réinitialiser
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (!confirm('⚠️ Supprimer TOUTES les transactions et objectifs ? Cette action est irréversible.')) return;
            localStorage.removeItem('transactions');
            localStorage.removeItem('depenses');
            localStorage.removeItem('goals');
            localStorage.removeItem('expenses');
            showToast('Données réinitialisées');
        });
    }
}

// ─── Toast notification ───────────────────────────────────────────────────────
function showToast(msg) {
    let toast = document.getElementById('settings-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'settings-toast';
        toast.style.cssText = `
            position:fixed;bottom:30px;right:30px;
            background:#2d2d33;color:#e0e0e0;
            padding:12px 20px;border-radius:8px;
            border:1px solid #424249;
            font-size:14px;z-index:9999;
            box-shadow:0 4px 12px rgba(0,0,0,0.4);
            transition:opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initTabs();
    initColorPicker();
    initButtons();
    renderCategoriesList();
    renderEditPanel();

    // Restaurer préférences
    const currency = localStorage.getItem('pref_currency');
    const lang     = localStorage.getItem('pref_lang');
    if (currency) { const el = document.getElementById('pref-currency'); if (el) el.value = currency; }
    if (lang)     { const el = document.getElementById('pref-lang');     if (el) el.value = lang; }
});
