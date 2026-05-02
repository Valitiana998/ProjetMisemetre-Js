// Goals Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    const goalsContainer = document.querySelector('.goals-container');
    const newGoalBtn = document.querySelector('.page-header .btn-primary');

    if (newGoalBtn) {
        newGoalBtn.addEventListener('click', function() {
            window.location.href = 'addObjectif.html';
        });
    }

    // Get goals from localStorage
    function getGoals() {
        return JSON.parse(localStorage.getItem('goals')) || [];
    }

    // Save goals to localStorage
    function saveGoals(goals) {
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    // Create goal card
    function createGoalCard(goal) {
        const card = document.createElement('div');
        card.className = `goal-card ${goal.active ? 'active' : ''}`;
        const percentage = (goal.saved / goal.target) * 100;

        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-title">
                    <h3>${goal.name}</h3>
                    <p class="goal-date">Prévu pour: ${goal.dueDate}</p>
                </div>
                <span class="goal-icon">${goal.icon}</span>
            </div>
            <div class="goal-progress">
                <div class="progress-info">
                    <span class="progress-value">${Math.round(percentage)}%</span>
                    <p class="progress-text">${goal.saved.toLocaleString('fr-FR')} Ar / ${goal.target.toLocaleString('fr-FR')} Ar</p>
                </div>
                <div class="progress-bar large">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;"></div>
                </div>
            </div>
            <div class="goal-stats">
                <div class="goal-stat">
                    <p class="stat-label">Épargné</p>
                    <p class="stat-value">${goal.saved.toLocaleString('fr-FR')} Ar</p>
                </div>
                <div class="goal-stat">
                    <p class="stat-label">Objectif</p>
                    <p class="stat-value">${goal.target.toLocaleString('fr-FR')} Ar</p>
                </div>
                <div class="goal-stat">
                    <p class="stat-label">Restant</p>
                    <p class="stat-value">${Math.max(0, goal.target - goal.saved).toLocaleString('fr-FR')} Ar</p>
                </div>
            </div>
            <div class="goal-actions">
                <button class="btn-secondary edit-goal" data-id="${goal.id}">Éditer</button>
                <button class="btn-tertiary add-funds" data-id="${goal.id}">Ajouter des fonds</button>
                <button class="btn-danger delete-goal" data-id="${goal.id}">Supprimer</button>
            </div>
        `;

        return card;
    }

    // Render goals
    function renderGoals() {
        const goals = getGoals();
        if (goalsContainer) {
            goalsContainer.innerHTML = '';
            if (goals.length === 0) {
                goalsContainer.innerHTML = '<p style="text-align: center; color: #a0a0a0; padding: 40px;">Aucun objectif créé. Créez votre premier objectif!</p>';
            } else {
                goals.forEach(goal => {
                    goalsContainer.appendChild(createGoalCard(goal));
                });
            }

            // Add event listeners
            document.querySelectorAll('.edit-goal').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const goal = goals.find(g => g.id === id);
                    console.log('Editing goal:', goal);
                    alert('Édition de l\'objectif: ' + goal.name);
                    // TODO: Open edit form
                });
            });

            document.querySelectorAll('.add-funds').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const goal = goals.find(g => g.id === id);
                    const amount = prompt('Montant à ajouter (Ar):', '');
                    if (amount && !isNaN(amount)) {
                        goal.saved += parseFloat(amount);
                        saveGoals(goals);
                        renderGoals();
                        alert('✅ Fonds ajoutés avec succès!');
                    }
                });
            });

            document.querySelectorAll('.delete-goal').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
                        const updatedGoals = goals.filter(g => g.id !== id);
                        saveGoals(updatedGoals);
                        renderGoals();
                    }
                });
            });
        }
    }

    // Initialize
    renderGoals();

    // Listen for goal updates from other pages
    window.addEventListener('storage', function(e) {
        if (e.key === 'goals') {
            renderGoals();
        }
    });
});
