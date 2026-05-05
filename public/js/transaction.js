document.addEventListener('DOMContentLoaded', () => {
    
    // === ÉLÉMENTS DOM ===
    const editIdInput = document.getElementById('editId');
    const transactionForm = document.getElementById('transactionForm');
    const transactionsList = document.getElementById('transactionsList');
    const transactionCount = document.getElementById('transactionCount');
    const totalEntries = document.getElementById('totalEntries');
    const netBalance = document.getElementById('netBalance');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnCancel = document.getElementById('btnCancel');
    const currentMonthYear = document.getElementById('currentMonthYear');
    
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    // === ICÔNES PAR CATÉGORIE ===
    const categoryIcons = {
        salaire: '💰', business: '💼', investissement: '📈',
        logement: '🏠', transport: '🚗', alimentation: '🍔',
        electricite: '💡', loisirs: '🎬', sante: '🏥',
        education: '📚', shopping: '🛍️', autre: '📌'
    };
    
    // === INITIALISATION ===
    function init() {
        // Date par défaut
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
        
        // Charger les transactions
        renderTransactions();
        updateMonthDisplay();
        
        // Gestion boutons type
        const btnTypes = document.querySelectorAll('.btn-type');
        btnTypes.forEach(btn => {
            btn.addEventListener('click', function() {
                btnTypes.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const typeInput = document.getElementById('transactionType');
                if (typeInput) {
                    typeInput.value = this.dataset.type;
                }
            });
        });
        
        // Navigation mois
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateMonthDisplay();
            renderTransactions();
        });
        
        document.getElementById('nextMonth')?.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateMonthDisplay();
            renderTransactions();
        });
        
        // Bouton annuler
        btnCancel?.addEventListener('click', () => {
            resetForm();
        });
    }
    
    // === SOUMISSION FORMULAIRE ===
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const editId = editIdInput?.value;
            const transactionId = editId ? String(editId) : Date.now().toString();
            
            const transaction = {
                id: transactionId,
                type: document.getElementById('transactionType')?.value || 'expense',
                libelle: document.getElementById('libelle')?.value || '',
                category: document.getElementById('category')?.value,
                amount: parseFloat(document.getElementById('amount')?.value) || 0,
                date: document.getElementById('date')?.value,
            };
            
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            
            if (editId) {
                const index = transactions.findIndex(t => String(t.id) === String(transactionId));
                if (index !== -1) {
                    transactions[index] = transaction;
                }
            } else {
                transactions.push(transaction);
            }
            
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            resetForm();
            renderTransactions();
        });
    }
    
    // === AFFICHAGE TRANSACTIONS ===
    function renderTransactions() {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        // Filtrer par mois
        const monthTransactions = transactions.filter(t => {
            if (!t.date) return false;
            const txDate = new Date(t.date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });
        
        // Trier par date (plus récent d'abord)
        monthTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Mettre à jour le compteur
        if (transactionCount) {
            transactionCount.textContent = monthTransactions.length;
        }
        
        if (transactionsList) {
            transactionsList.innerHTML = '';
            
            if (monthTransactions.length === 0) {
                transactionsList.innerHTML = '<p style="text-align:center; color:#888; padding: 2rem;">Aucune transaction ce mois-ci.</p>';
                updateSummary([]);
                return;
            }
            
            monthTransactions.forEach(t => {
                const isExpense = t.type === 'expense';
                const icon = categoryIcons[t.category] || '📌';
                const amountSign = isExpense ? '-' : '+';
                const amountClass = isExpense ? 'negative' : 'positive';
                const safeId = String(t.id).replace(/'/g, "\\'");
                
                const itemHTML = `
                    <div class="transaction-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #f0f0f0;">
                        <div class="transaction-info" style="display: flex; align-items: center; gap: 1rem;">
                            <span class="transaction-icon" style="font-size: 1.5rem;">${icon}</span>
                            <div class="transaction-details">
                                <div style="font-weight: 600; color: #1a1a2e;">${t.libelle || t.category}</div>
                                <div style="font-size: 0.875rem; color: #666;">${formatDate(t.date)} • ${getCategoryName(t.category)}</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="transaction-amount ${amountClass}" style="font-weight: 600; font-size: 1.1rem;">
                                ${amountSign}${formatAmount(t.amount)} Ar
                            </div>
                            <div class="tx-actions">
                                <button class="btn btn-icon" onclick="editTransaction('${safeId}')" style="background:none; border:none; cursor:pointer; padding: 4px;">✏️</button>
                                <button class="btn btn-icon danger" onclick="deleteTransaction('${safeId}')" style="background:none; border:none; cursor:pointer; padding: 4px; color: #e74c3c;">✕</button>
                            </div>
                        </div>
                    </div>
                `;
                transactionsList.innerHTML += itemHTML;
            });
        }
        
        updateSummary(monthTransactions);
    }
    
    // === METTRE À JOUR RÉSUMÉ ===
    function updateSummary(transactions) {
        if (totalEntries) {
            totalEntries.textContent = `${transactions.length} entré${transactions.length > 1 ? 'es' : 'e'}`;
        }
        
        const total = transactions.reduce((sum, t) => {
            return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);
        
        if (netBalance) {
            netBalance.textContent = `${formatAmount(total)} Ar`;
            netBalance.className = total >= 0 ? 'positive' : 'negative';
        }
    }
    
    // === ÉDITER TRANSACTION ===
    window.editTransaction = function(id) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const tx = transactions.find(t => String(t.id) === String(id));
        
        if (tx) {
            if (editIdInput) editIdInput.value = id;
            if (document.getElementById('transactionType')) document.getElementById('transactionType').value = tx.type;
            if (document.getElementById('libelle')) document.getElementById('libelle').value = tx.libelle || '';
            if (document.getElementById('category')) document.getElementById('category').value = tx.category;
            if (document.getElementById('amount')) document.getElementById('amount').value = tx.amount;
            if (document.getElementById('date')) document.getElementById('date').value = tx.date;
            
            // Mettre à jour les boutons type
            document.querySelectorAll('.btn-type').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.type === tx.type) btn.classList.add('active');
            });
            
            if (btnSubmit) btnSubmit.textContent = 'Mettre à jour';
            if (btnCancel) btnCancel.style.display = 'inline-block';
            
            // Scroll vers le formulaire
            document.querySelector('.form-section-card')?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    // === SUPPRIMER TRANSACTION ===
    window.deleteTransaction = function(id) {
        if (confirm('Voulez-vous vraiment supprimer cette transaction ?')) {
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const updatedTransactions = transactions.filter(t => String(t.id) !== String(id));
            localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            renderTransactions();
        }
    };
    
    // === UTILITAIRES ===
    function resetForm() {
        if (transactionForm) transactionForm.reset();
        if (editIdInput) editIdInput.value = '';
        if (document.getElementById('date')) {
            document.getElementById('date').valueAsDate = new Date();
        }
        if (btnSubmit) btnSubmit.textContent = 'Ajouter la transaction';
        if (btnCancel) btnCancel.style.display = 'none';
        
        // Reset type buttons
        document.querySelectorAll('.btn-type').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === 'expense') btn.classList.add('active');
        });
        if (document.getElementById('transactionType')) {
            document.getElementById('transactionType').value = 'expense';
        }
    }
    
    function updateMonthDisplay() {
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        if (currentMonthYear) {
            const count = transactionCount?.textContent || '0';
            currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear} — ${count} transactions`;
        }
    }
    
    function formatAmount(amount) {
        return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
    
    function getCategoryName(category) {
        const names = {
            salaire: 'Salaire', business: 'Business', investissement: 'Investissement',
            logement: 'Logement', transport: 'Transport', alimentation: 'Alimentation',
            electricite: 'Électricité', loisirs: 'Loisirs', sante: 'Santé',
            education: 'Éducation', shopping: 'Shopping', autre: 'Autre'
        };
        return names[category] || category;
    }
    
    // Initialisation
    init();
});