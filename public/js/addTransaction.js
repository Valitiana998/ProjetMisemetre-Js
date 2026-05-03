document.addEventListener('DOMContentLoaded', () => {
    
    // ➕ Récupérer l'ID depuis l'URL (pour édition)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    // ➕ Si on est en mode édition, pré-remplir le formulaire
    if (editId) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        // 🔑 Conversion explicite des deux côtés pour être sûr que ça matche
        const tx = transactions.find(t => String(t.id) === String(editId));
        
        if (tx) {
            if (document.getElementById('transactionType')) 
                document.getElementById('transactionType').value = tx.type;
            if (document.getElementById('category')) 
                document.getElementById('category').value = tx.category;
            if (document.getElementById('amount')) 
                document.getElementById('amount').value = tx.amount;
            if (document.getElementById('date')) 
                document.getElementById('date').value = tx.date ? tx.date.split('T')[0] : '';
            if (document.getElementById('description')) 
                document.getElementById('description').value = tx.description || '';
            
            const btn = document.querySelector('button[type="submit"]');
            if (btn) btn.textContent = '✏️ Mettre à jour';
        }
    }

    // ➕ Initialisation date par défaut (si pas en édition)
    if (!editId && document.getElementById('date')) {
        document.getElementById('date').valueAsDate = new Date();
    }

    // ➕ Gestion soumission formulaire
    const form = document.getElementById('transactionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 🔑 ID normalisé en STRING dès le départ (évite les conflits number/string)
            const transactionId = editId ? String(editId) : Date.now().toString();
            
            const transaction = {
                id: transactionId,
                type: document.getElementById('transactionType')?.value || 'expense',
                category: document.getElementById('category')?.value,
                amount: parseFloat(document.getElementById('amount')?.value) || 0,
                date: document.getElementById('date')?.value,
                description: document.getElementById('description')?.value || '',
            };
            
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            
            if (editId) {
                // 🔐 Mode modification : on utilise le MÊME format de comparaison
                const index = transactions.findIndex(t => String(t.id) === String(transactionId));
                
                if (index !== -1) {
                    // ✅ Mise à jour à l'index trouvé (pas de push !)
                    transactions[index] = transaction;
                } else {
                    // ⚠️ Si pas trouvé, on ajoute quand même pour éviter la perte de données
                    console.warn("Transaction non trouvée, ajout en tant que nouvelle");
                    transactions.push(transaction);
                }
            } else {
                // ➕ Mode ajout : push nouveau
                transactions.push(transaction);
            }
            
            // Sauvegarde
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            // Redirection
            window.location.href = 'transactions.html';
        });
    }

    // ➕ Gestion boutons type (Dépense/Revenu)
    const btnTypes = document.querySelectorAll('.btn-type');
    btnTypes.forEach(btn => {
        btn.addEventListener('click', function() {
            btnTypes.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (document.getElementById('transactionType')) {
                document.getElementById('transactionType').value = this.dataset.type;
            }
        });
    });

});