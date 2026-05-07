document.addEventListener('DOMContentLoaded', function() {
    const goalsContainer = document.querySelector('.goals-container');
    const newGoalBtn = document.querySelector('.page-header .btn-primary');

    if (newGoalBtn) {
        newGoalBtn.addEventListener('click', function() {
            window.location.href = 'addObjectif.html';
        });
    }

    function getGoals() {
        return JSON.parse(localStorage.getItem('goals')) || [];
    }

    
    function saveGoals(goals) {
        localStorage.setItem('goals', JSON.stringify(goals));
    }

  
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
                        alert('Fonds ajoutés avec succès!');
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

    
        updateSummaryCards(goals);
    }

    function updateSummaryCards(expenses) {
     
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const solde =JSON.parse(localStorage.getItem('solde')) || [];
        const totalRemaining = goals.reduce((sum, g) => {
            const saved = parseFloat(g.saved) || 0;
            const target = parseFloat(g.target) || 0;
            return sum + Math.max(0, target - saved);
        }, 0);

        const totalCount = goals.length;

        const totalMonthEl = document.getElementById('total-month');
        if (totalMonthEl) {
            totalMonthEl.textContent = `${totalRemaining.toLocaleString('fr-FR')} Ar`;
        }

        const totalCountEl = document.getElementById('next-payment-title');
        totalCountEl.textContent = ` ${totalCount}`;
       
    }

    renderGoals();
    window.addEventListener('storage', function(e) {
        if (e.key === 'goals') {
            renderGoals();
        }
    });
});



