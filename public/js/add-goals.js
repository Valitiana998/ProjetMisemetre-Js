document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form') || document.getElementById('goalForm');
    
    if (!form) {
        console.warn('Goal form not found');
        return;
    }

  
    const goalNameInput = document.getElementById('goalName') || form.querySelector('input[name="goalName"]');
    const targetAmountInput = document.getElementById('targetAmount') || form.querySelector('input[name="targetAmount"]');
    const dueDateInput = document.getElementById('dueDate') || form.querySelector('input[name="dueDate"]');
    const goalIconInput = document.getElementById('goalIcon') || form.querySelector('input[name="goalIcon"]');
    const goalDescriptionInput = document.getElementById('goalDescription') || form.querySelector('textarea[name="goalDescription"]');

    if (!form.innerHTML.includes('goalName')) {
        form.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 20px; padding: 30px; background: #2d2d33; border-radius: 12px; color: #e0e0e0;">
                <h2>Créer un Nouvel Objectif</h2>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label for="goalName" style="font-weight: 500;">Nom de l'objectif</label>
                    <input type="text" id="goalName" placeholder="Ex: Vacances d'été" required style="padding: 12px; border: 1px solid #424249; border-radius: 8px; background: #383841; color: #e0e0e0;">
                </div>

                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <label for="targetAmount" style="font-weight: 500;">Montant cible (Ar)</label>
                        <input type="number" id="targetAmount" placeholder="5000000" required style="padding: 12px; border: 1px solid #424249; border-radius: 8px; background: #383841; color: #e0e0e0;">
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <label for="dueDate" style="font-weight: 500;">Date limite</label>
                        <input type="date" id="dueDate" required style="padding: 12px; border: 1px solid #424249; border-radius: 8px; background: #383841; color: #e0e0e0;">
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label for="goalIcon" style="font-weight: 500;">Emoji/Icône</label>
                    <input type="text" id="goalIcon" placeholder="✈️" maxlength="5" style="padding: 12px; border: 1px solid #424249; border-radius: 8px; background: #383841; color: #e0e0e0;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label for="goalDescription" style="font-weight: 500;">Description</label>
                    <textarea id="goalDescription" placeholder="Décrivez votre objectif..." style="padding: 12px; border: 1px solid #424249; border-radius: 8px; background: #383841; color: #e0e0e0; resize: vertical; min-height: 100px;"></textarea>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button type="submit" style="flex: 1; padding: 12px; background: #6ba0ff; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Créer l'objectif</button>
                    <button type="button" id="cancelBtn" style="flex: 1; padding: 12px; background: #424249; color: #e0e0e0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Annuler</button>
                </div>
            </div>
        `;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const goalName = document.getElementById('goalName').value.trim();
        const targetAmount = parseFloat(document.getElementById('targetAmount').value);
        const dueDate = document.getElementById('dueDate').value;
        const goalIcon = document.getElementById('goalIcon').value || '🎯';
        const goalDescription = document.getElementById('goalDescription').value;

        // Validation
        if (!goalName || !targetAmount || !dueDate) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (targetAmount <= 0) {
            alert('Le montant doit être supérieur à 0');
            return;
        }

        // Create goal object
        const newGoal = {
            id: Date.now().toString(),
            name: goalName,
            target: targetAmount,
            saved: 0,
            dueDate: new Date(dueDate).toLocaleDateString('fr-FR'),
            icon: goalIcon,
            description: goalDescription,
            createdDate: new Date().toLocaleDateString('fr-FR'),
            active: true
        };

      
        const existingGoals = JSON.parse(localStorage.getItem('goals')) || [];
        existingGoals.push(newGoal);

        // Save to localStorage
        localStorage.setItem('goals', JSON.stringify(existingGoals));

        alert('Objectif créé avec succès!');
        window.location.href = 'goals.html';
    });

    
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr? Les données non enregistrées seront perdues.')) {
                window.location.href = 'goals.html';
            }
        });
    }
});
