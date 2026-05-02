// Budget Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    const budgetContainer = document.querySelector('.budget-container');
    const newBudgetBtn = document.querySelector('.btn-primary');

    if (newBudgetBtn) {
        newBudgetBtn.addEventListener('click', function() {
            console.log('Creating new budget...');
            // TODO: Open modal for creating new budget
            alert('Formulaire de création de budget (à implémenter)');
        });
    }

    // Get budgets from localStorage
    function getBudgets() {
        return JSON.parse(localStorage.getItem('budgets')) || [];
    }

    // Save budgets to localStorage
    function saveBudgets(budgets) {
        localStorage.setItem('budgets', JSON.stringify(budgets));
    }

    // Create budget card
    function createBudgetCard(budget) {
        const card = document.createElement('div');
        card.className = 'budget-card';
        const percentage = (budget.spent / budget.limit) * 100;
        const statusClass = percentage >= 90 ? 'warning' : '';

        card.innerHTML = `
            <div class="budget-header">
                <h3>${budget.category}</h3>
                <span class="budget-status ${statusClass}">${Math.round(percentage)}% utilisé</span>
            </div>
            <div class="budget-stats">
                <p class="budget-spent">Dépensé: <strong>${budget.spent.toLocaleString('fr-FR')} Ar</strong></p>
                <p class="budget-limit">Limite: ${budget.limit.toLocaleString('fr-FR')} Ar</p>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;"></div>
            </div>
            <div class="budget-info">
                <p>${budget.limit - budget.spent > 0 ? 'Encore ' : 'Dépassement de '} ${Math.abs(budget.limit - budget.spent).toLocaleString('fr-FR')} Ar</p>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="edit-budget" data-id="${budget.id}" style="flex:1; padding: 8px; background: #6ba0ff; color: white; border: none; border-radius: 6px; cursor: pointer;">Éditer</button>
                <button class="delete-budget" data-id="${budget.id}" style="flex:1; padding: 8px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;">Supprimer</button>
            </div>
        `;

        return card;
    }

    // Render budgets
    function renderBudgets() {
        const budgets = getBudgets();
        if (budgetContainer && budgets.length > 0) {
            budgetContainer.innerHTML = '';
            budgets.forEach(budget => {
                budgetContainer.appendChild(createBudgetCard(budget));
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-budget').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    console.log('Editing budget:', id);
                    alert('Édition du budget (à implémenter)');
                });
            });

            document.querySelectorAll('.delete-budget').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
                        const budgets = getBudgets().filter(b => b.id !== id);
                        saveBudgets(budgets);
                        renderBudgets();
                    }
                });
            });
        }
    }

    // Initialize
    renderBudgets();

    // Listen for budget updates from other pages
    window.addEventListener('storage', function(e) {
        if (e.key === 'budgets') {
            renderBudgets();
        }
    });
});
