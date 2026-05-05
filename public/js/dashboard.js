/**
 * dashboard.js - Logique spécifique au tableau de bord
 */

document.addEventListener('DOMContentLoaded', () => {
    // Données initiales (à remplacer par un appel API en production)
    const dashboardData = {
        currentMonth: { year: 2026, month: 3 }, // Avril = index 3
        balance: 450000,
        income: 1500000,
        expenses: 1050000,
        expenseCategories: [
            { label: 'Logement', value: 470000, color: '#5B7FD4' },
            { label: 'Transport', value: 210000, color: '#1BC47D' },
            { label: 'Loisirs', value: 158000, color: '#FFA500' },
            { label: 'Alimentation', value: 126000, color: '#9B59B6' },
            { label: 'Autre', value: 86000, color: '#8B96A8' }
        ],
        upcoming: [
            { title: 'Loyer', amount: -600000, date: '2026-05-02', icon: 'loyer' },
            { title: 'Netflix', amount: -32000, date: '2026-05-05', icon: 'netflix' },
            { title: 'Crédit voiture', amount: -180000, date: '2026-05-07', icon: 'credit' }
        ],
        goals: [
            { title: 'Vacances été', current: 1550000, target: 2500000 },
            { title: 'Nouvel ordinateur', current: 1120000, target: 4000000 }
        ]
    };

    // Initialisation
    initDateNavigation();
    initStatsCards(dashboardData);
    initPieChart(dashboardData.expenseCategories);
    initUpcomingList(dashboardData.upcoming);
    initObjectives(dashboardData.goals);
});

// 📅 Navigation mois précédent/suivant
function initDateNavigation() {
    const monthYearEl = document.getElementById('monthYear');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    let currentDate = new Date(2026, 3); // Avril 2026
    
    function updateDisplay() {
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                           'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        monthYearEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Ici : recharger les données du mois sélectionné (appel API simulé)
        refreshDashboardData(currentDate);
    }
    
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateDisplay();
    });
    
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateDisplay();
    });
    
    updateDisplay();
}

// 🔄 Simulation de rafraîchissement des données
function refreshDashboardData(date) {
    console.log(`Chargement des données pour ${date.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'})}`);
    // À remplacer par : fetch(`/api/dashboard?month=${date.getMonth()}&year=${date.getFullYear()}`)
}

// 📊 Mise à jour des cartes de statistiques
function initStatsCards(data) {
    const [soldeEl, revenusEl, depensesEl] = document.querySelectorAll('.stat-card .amount');
    
    soldeEl.textContent = AppUtils.formatCurrency(data.balance);
    revenusEl.textContent = AppUtils.formatCurrency(data.income);
    depensesEl.textContent = AppUtils.formatCurrency(data.expenses);
    
    // Animation d'apparition
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
}

// 🥧 Initialisation du graphique camembert (Chart.js)
function initPieChart(categories) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    
    // Destruction d'un éventuel graphique existant
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }
    
    window.pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.label),
            datasets: [{
                data: categories.map(c => c.value),
                backgroundColor: categories.map(c => c.color),
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(45, 45, 51, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#424249',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = ((value / total) * 100).toFixed(1);
                            return ` ${context.label}: ${AppUtils.formatCurrency(value)} (${percent}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000
            }
        }
    });
}

// 📋 Liste des dépenses à venir
function initUpcomingList(items) {
    const container = document.querySelector('.upcoming-list');
    if (!container) return;
    
    container.innerHTML = items.map(item => {
        const days = AppUtils.getDaysUntil(item.date);
        const dateStr = AppUtils.formatDateFR(new Date(item.date), { day: '2-digit', month: 'short' });
        const daysText = days > 0 ? `dans ${days} jours` : 'aujourd\'hui';
        
        return `
            <div class="upcoming-item">
                <div class="item-left">
                    <span class="dot ${item.icon}"></span>
                    <div class="item-info">
                        <p>${item.title}</p>
                        <span class="date">${dateStr} · ${daysText}</span>
                    </div>
                </div>
                <p class="amount negative">−${AppUtils.formatCurrency(Math.abs(item.amount)).replace('Ar', '').trim()} Ar</p>
            </div>
        `;
    }).join('');
}

// 🎯 Objectifs d'épargne avec barres de progression
function initObjectives(goals) {
    const container = document.querySelector('.objectives-card');
    if (!container) return;
    
    // Conserver le titre et remplacer le contenu
    const title = container.querySelector('h3');
    container.innerHTML = '';
    container.appendChild(title);
    
    goals.forEach(goal => {
        const percent = Math.round((goal.current / goal.target) * 100);
        const item = document.createElement('div');
        item.className = 'objective-item';
        item.innerHTML = `
            <div class="objective-header">
                <p class="objective-title">${goal.title}</p>
                <span class="percentage">${percent}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%;"></div>
            </div>
            <p class="objective-text">${AppUtils.formatCurrency(goal.current)} sur ${AppUtils.formatCurrency(goal.target)}</p>
        `;
        container.appendChild(item);
        
        // Animation de la barre de progression
        setTimeout(() => {
            const fill = item.querySelector('.progress-fill');
            fill.style.transition = 'width 1s ease-out';
            fill.style.width = `${percent}%`;
        }, 300);
    });
}

// 🎨 Fonction utilitaire : générer une couleur aléatoire (pour nouvelles catégories)
function generateColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 65%, 55%)`;
}

// Export des fonctions pour tests ou utilisation externe
window.Dashboard = {
    refreshData: refreshDashboardData,
    updateChart: initPieChart,
    formatCurrency: AppUtils.formatCurrency
};