// reports.js - Gestion des dépenses à venir

// === CONFIGURATION GLOBALE ===
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const today = new Date();

// Icônes par catégorie
const categoryIcons = {
    'Logement': '🏠',
    'Transport': '🚗',
    'Alimentation': '🍔',
    'Loisirs': '🎬',
    'Électricité & Eau': '💡',
    'Santé': '🏥',
    'Éducation': '📚',
    'Shopping': '🛍️',
    'Dette': '💳',
    'Autre': '📌'
};

// Noms lisibles des catégories
const categoryNames = {
    'Logement': 'Logement',
    'Transport': 'Transport',
    'Alimentation': 'Alimentation',
    'Loisirs': 'Loisirs',
    'Électricité & Eau': 'Électricité & Eau',
    'Santé': 'Santé',
    'Éducation': 'Éducation',
    'Shopping': 'Shopping',
    'Dette': 'Dette',
    'Autre': 'Autre'
};

// === FONCTIONS UTILITAIRES ===

// Formater un montant en Ariary
function formatAmount(amount) {
    return new Intl.NumberFormat('fr-MG').format(Math.abs(amount));
}

// Formater une date pour l'affichage
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

// Formater une date courte pour le calendrier
function formatShortDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short'
    }).format(date);
}

// Obtenir le nom lisible d'une catégorie
function getCategoryName(category) {
    return categoryNames[category] || category;
}

// Calculer la prochaine occurrence d'une dépense récurrente
function getNextOccurrence(dateString, frequency) {
    const baseDate = new Date(dateString);
    const now = new Date();
    let nextDate = new Date(baseDate);

    // Si la date de base est dans le futur, on la garde
    if (baseDate >= now) {
        return baseDate;
    }

    // Sinon, on projette dans le futur selon la fréquence
    switch (frequency) {
        case 'Hebdomadaire':
            while (nextDate < now) {
                nextDate.setDate(nextDate.getDate() + 7);
            }
            break;
        case 'Mensuel':
            while (nextDate < now) {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }
            break;
        case 'Trimestriel':
            while (nextDate < now) {
                nextDate.setMonth(nextDate.getMonth() + 3);
            }
            break;
   case 'Unique':
        default:
            return null;
    }
    return nextDate;
}
function isWithinNext30Days(date) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return date >= today && date <= thirtyDaysFromNow;
}

function loadExpenses() {
    try {
        const stored = localStorage.getItem('expenses');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Erreur de chargement des dépenses:', e);
        return [];
    }
}
function getUpcomingExpenses(filter = 'all') {
    const expenses = loadExpenses();
    const upcoming = [];

    expenses.forEach(expense => {
        
        if (expense.type === 'income') return;
        
        if (filter !== 'all' && expense.frequency?.toLowerCase() !== filter.toLowerCase()) {
            return;
        }

        // Calculer la prochaine occurrence
        const nextDate = getNextOccurrence(expense.date, expense.frequency);
        
        // Si la prochaine occurrence est dans les 30 prochains jours
        if (nextDate && isWithinNext30Days(nextDate)) {
            upcoming.push({
                ...expense,
                nextOccurrence: nextDate,
                displayDate: nextDate.toISOString().split('T')[0]
            });
        }
    });

    // Trier par date croissante
    return upcoming.sort((a, b) => a.nextOccurrence - b.nextOccurrence);
}

// === AFFICHAGE DANS L'INTERFACE ===

// Mettre à jour les cartes de résumé
function updateSummaryCards(expenses) {
    const totalMonth = expenses.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalCount = expenses.length;
    
    // Total à payer ce mois
    document.getElementById('total-month').textContent = `${formatAmount(totalMonth)} Ar`;
    document.getElementById('total-count').textContent = `${totalCount} prélèvement${totalCount > 1 ? 's' : ''}`;
    
    // Prochain paiement
    if (expenses.length > 0) {
        const next = expenses[0];
        document.getElementById('next-payment-title').textContent = next.libelle || next.category || 'Sans titre';
        document.getElementById('next-payment-date').textContent = `${formatShortDate(next.displayDate)} • ${getCategoryName(next.category)}`;
    } else {
        document.getElementById('next-payment-title').textContent = 'Aucun';
        document.getElementById('next-payment-date').textContent = 'Aucune charge prévue';
    }
    
    // Solde projeté (simplifié - à adapter avec vos revenus)
    const projectedBalance = -totalMonth; // À remplacer par: revenus - dépenses
    const balanceEl = document.getElementById('projected-balance');
    balanceEl.textContent = `${projectedBalance >= 0 ? '+' : '-'}${formatAmount(projectedBalance)} Ar`;
    balanceEl.className = `card-value ${projectedBalance >= 0 ? 'green' : 'red'}`;
}

// Générer un élément de timeline pour une dépense
function createTimelineItem(expense) {
    const icon = categoryIcons[expense.category] || '📌';
    const day = expense.nextOccurrence.getDate();
    const month = expense.nextOccurrence.toLocaleDateString('fr-FR', { month: 'short' });
    const dayName = expense.nextOccurrence.toLocaleDateString('fr-FR', { weekday: 'short' });
    
    return `
        <div class="timeline-item" data-frequency="${expense.frequency || 'Unique'}">
            <div class="timeline-date">
                <div class="date-day">${day}</div>
                <div class="date-month">${month}</div>
                <div class="date-weekday">${dayName}</div>
            </div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-icon">${icon}</span>
                    <span class="timeline-title">${expense.libelle || getCategoryName(expense.category)}</span>
                    <span class="timeline-badge ${expense.frequency === 'Mensuel' ? 'badge-monthly' : 'badge-other'}">
                        ${expense.frequency || 'Unique'}
                    </span>
                </div>
                <div class="timeline-details">
                    <span class="detail-category">${getCategoryName(expense.category)}</span>
                    <span class="detail-payment">• ${expense.payment || 'Paiement'}</span>
                </div>
                <div class="timeline-amount negative">
                    -${formatAmount(expense.amount)} Ar
                </div>
                
                ${expense.description ? `<div class="timeline-description">${expense.description}</div>` : ''}
                <div class="tx-actions">
                    <button class="btn btn-icon" onclick="editDepense('')" style="background:none; border:none; cursor:pointer; padding: 4px;">✏️</button>
                     <button class="btn btn-icon danger" onclick="deleteDepense('')" style="background:none; border:none; cursor:pointer; padding: 4px; color: #e74c3c;">✕</button>
                 </div>
            </div>
        </div>
    `;
}

// Afficher la timeline des dépenses
function renderTimeline(expenses) {
    const timeline = document.getElementById('timeline');
    
    if (!timeline) {
        console.warn('Élément #timeline non trouvé');
        return;
    }
    
    if (expenses.length === 0) {
        timeline.innerHTML = `
            <div class="timeline-empty">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
                <p style="color: #666; font-size: 1.1rem;">Aucune dépense prévue dans les 30 prochains jours</p>
                <a href="../html/addDepenese.html" class="btn-primary" style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span>+</span> Ajouter une charge
                </a>
                </button>
            </div>
        `;
        return;
    }
    
    timeline.innerHTML = expenses.map(createTimelineItem).join('');
}

// === GESTION DES FILTRES ===

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour de l'état actif
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Application du filtre
            const filter = btn.dataset.filter;
            const expenses = getUpcomingExpenses(filter);
            renderTimeline(expenses);
            updateSummaryCards(expenses);
        });
    });
}

// === INITIALISATION ===

function initReports() {
    // Charger et afficher les données
    const expenses = getUpcomingExpenses('all');
    updateSummaryCards(expenses);
    renderTimeline(expenses);
    
    // Activer les filtres
    setupFilters();
    
    // Rafraîchir automatiquement si le stockage change (onglets multiples)
    window.addEventListener('storage', (e) => {
        if (e.key === 'expenses') {
            const expenses = getUpcomingExpenses('all');
            updateSummaryCards(expenses);
            renderTimeline(expenses);
        }
    });
    
    console.log('📊 Reports initialisés -', expenses.length, 'dépenses à venir');
}

// Lancer l'initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initReports);

// Export pour utilisation externe si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadExpenses,
        getUpcomingExpenses,
        formatAmount,
        formatDate
    };
}
