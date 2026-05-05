
document.addEventListener('DOMContentLoaded', function() {
    
    const expenseForm = document.getElementById('expenseForm');
    
    if (!expenseForm) {
        console.log('Formulaire non trouvé - ce script ne s\'applique pas à cette page');
        return; 
    }

    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const expense = {
            id: Date.now(),
            title: document.getElementById('title')?.value || '',
            amount: document.getElementById('amount')?.value || '',
            date: document.getElementById('date')?.value || '',
            category: document.getElementById('category')?.value || '',
            frequency: document.getElementById('frequency')?.value || '',
            payment: document.getElementById('payment')?.value || '',
            description: document.getElementById('description')?.value || ''
        };

      
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

     
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        alert('✅ Dépense ajoutée !');
        expenseForm.reset();

        
        window.location.href = 'reports.html';
    });
});