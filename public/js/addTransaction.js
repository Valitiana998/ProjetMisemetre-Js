document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const typeButtons = document.querySelectorAll('.btn-type');
    const transactionTypeInput = document.getElementById('transactionType');

    // 1. Gestion de la sélection du type (Dépense / Revenu)
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            transactionTypeInput.value = button.getAttribute('data-type');
        });
    });

    // 2. Gestion de la soumission du formulaire avec localStorage
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Création de l'objet transaction
        const formData = new FormData(transactionForm);
        const newTransaction = Object.fromEntries(formData.entries());
        
        // Ajout d'un identifiant unique (timestamp)
        newTransaction.id = Date.now();

        // Récupération des transactions existantes (ou tableau vide si inexistant)
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        // Ajout de la nouvelle transaction
        transactions.push(newTransaction);

        // Sauvegarde dans le localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Feedback utilisateur
        alert("Transaction enregistrée avec succès !");

        // Réinitialisation du formulaire
        transactionForm.reset();
        
        // Réinitialisation visuelle du type
        typeButtons.forEach(btn => btn.classList.remove('active'));
        typeButtons[0].classList.add('active');
        transactionTypeInput.value = 'expense';
        
        console.log('Données actuelles dans localStorage:', transactions);
    });
});