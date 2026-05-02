document.addEventListener('DOMContentLoaded', () => {
    const transactionsList = document.getElementById('transactionsList');
    
    // 1. Récupérer les données du localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // 2. Dictionnaire pour associer les catégories aux icônes
    const categoryIcons = {
        housing: '🏠', transport: '🚗', food: '🍔',
        utilities: '💡', entertainment: '🎬', shopping: '🛍️',
        health: '🏥', education: '📚', other: '📌'
    };

    // 3. Vérifier si le tableau est vide
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="text-align:center; color:#888;">Aucune transaction enregistrée pour le moment.</p>';
        return;
    }

    // 4. Générer le HTML pour chaque transaction
    // On utilise .reverse() pour afficher la plus récente en premier
    transactions.slice().reverse().forEach(t => {
        const isExpense = t.type === 'expense';
        const icon = categoryIcons[t.category] || '📌';
        const amountSign = isExpense ? '-' : '+';
        const amountClass = isExpense ? 'negative' : 'positive';

        // Création de l'élément HTML via template literals
        const itemHTML = `
            <div class="transaction-item">
                <div class="transaction-info">
                    <span class="transaction-icon">${icon}</span>
                    <div class="transaction-details">
                        <h4 class="transaction-title">${t.description || t.category}</h4>
                        <p class="transaction-date">${new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${amountSign}${parseFloat(t.amount).toFixed(2)} Ar
                </div>
            </div>
        `;

        transactionsList.innerHTML += itemHTML;
    });
});