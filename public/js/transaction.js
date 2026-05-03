// 1. Fonctions globales (Accessibles par les boutons onclick)
function deleteTx(id) {
    if (confirm("Voulez-vous vraiment supprimer cette transaction ?")) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        // 🔑 La ligne qui corrige tout : comparer en STRING
        const updatedTransactions = transactions.filter(t => String(t.id) === String(id) ? false : true);
        
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        renderTransactions();
    }
}

function editTx(id) {
    // Redirection vers la page addTransaction.html avec l'ID dans l'URL
    window.location.href = `addTransaction.html?id=${id}`;
}

// 2. Fonction pour générer l'affichage (Read)
// 2. Fonction pour générer l'affichage (Read)
function renderTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // 🔑 CORRECTION : Supprimer les doublons par ID (garde le dernier)
    const seen = {};
    transactions = transactions.filter(t => {
        const id = String(t.id);
        // On garde toujours la dernière occurrence d'un ID
        seen[id] = t;
        return true;
    });
    // Reconstruire le tableau sans doublons
    transactions = Object.values(seen);
    
    // Dictionnaire pour les icônes
    const categoryIcons = {
        housing: '🏠', transport: '🚗', food: '🍔',
        utilities: '💡', entertainment: '🎬', shopping: '🛍️',
        health: '🏥', education: '📚', other: '📌'
    };

    // Nettoyer la liste avant d'afficher
    transactionsList.innerHTML = '';

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="text-align:center; color:#888;">Aucune transaction enregistrée.</p>';
        return;
    }

    // Affichage (plus récentes en premier)
    transactions.slice().reverse().forEach(t => {
        const isExpense = t.type === 'expense';
        const icon = categoryIcons[t.category] || '📌';
        const amountSign = isExpense ? '-' : '+';
        const amountClass = isExpense ? 'negative' : 'positive';

        // 🔑 Sécuriser l'ID pour les onclick (échapper les quotes)
        const safeId = String(t.id).replace(/'/g, "\\'");

        const itemHTML = `
            <div class="transaction-item" data-tx-id="${t.id}">
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
                <div class="tx-actions">
                    <button class="btn btn-icon" onclick="editTx('${safeId}')">✏</button>
                    <button class="btn btn-icon danger" onclick="deleteTx('${safeId}')">✕</button>
                </div>
            </div>
        `;
        transactionsList.innerHTML += itemHTML;
    });
}


// 3. Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    renderTransactions();
});