document.addEventListener('DOMContentLoaded', () => {
    
  
    const transactionsList = document.querySelector('.transaction-table tbody');
    const pageinfo = document.querySelector('.page-info');
    const btnExport = document.querySelector('.btn-export');
    

    const statResults = document.querySelectorAll('.stat-value')[0];
    const statRevenus = document.querySelectorAll('.stat-value')[1];
    const statDepenses = document.querySelectorAll('.stat-value')[2];
    const statSolde = document.querySelectorAll('.stat-value')[3];
    const statMoyenne = document.querySelectorAll('.stat-value')[4];
    
  
    const periodBtns = document.querySelectorAll('.period-btn');
    const dateInputs = document.querySelectorAll('.date-input');
    const categorySelect = document.querySelector('.category-select');
    const btnReset = document.querySelector('.btn-reset');
    const activeFilters = document.querySelector('.active-filters');
    const tagCloses = document.querySelectorAll('.tag-close');
    
  
    const pageButtons = document.querySelectorAll('.page-btn');
    

    let allTransactions = [];
    let filteredTransactions = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    

    const categoryMap = {
        'Toutes catégories': null,
        'Santé': 'sante',
        'Alimentation': 'alimentation',
        'Transport': 'transport',
        'Loisirs': 'loisirs',
        'Logement': 'logement',
        'Salaire': 'salaire',
        'Business': 'business',
        'Investissement': 'investissement',
        'Électricité': 'electricite',
        'Éducation': 'education',
        'Shopping': 'shopping',
        'Autre': 'autre'
    };
    
    
    const categoryIcons = {
        salaire: '💰', business: '💼', investissement: '📈',
        logement: '🏠', transport: '🚗', alimentation: '🍔',
        electricite: '💡', loisirs: '🎬', sante: '🏥',
        education: '📚', shopping: '🛍️', autre: '📌', revenu: '💵'
    };
    
  
    function init() {
        loadTransactions();
        applyFilters();
        renderTable();
        updateStats();
        updatePagination();
        setupEventListeners();
    }
    
  
    function loadTransactions() {
        const stored = localStorage.getItem('transactions');
        allTransactions = stored ? JSON.parse(stored) : [];
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function applyFilters() {
        const selectedPeriod = document.querySelector('.period-btn.active')?.textContent;
        const [startDate, endDate] = Array.from(dateInputs).map(input => input.value);
        const selectedCategory = categorySelect?.value;
        
        filteredTransactions = allTransactions.filter(t => {
            if (!t.date) return false;
            const txDate = new Date(t.date);
            
            if (selectedPeriod === 'Mois') {
                const now = new Date();
                if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
                    return false;
                }
            } else if (selectedPeriod === '3 mois') {
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                if (txDate < threeMonthsAgo) return false;
            } else if (selectedPeriod === 'Année') {
                const now = new Date();
                if (txDate.getFullYear() !== now.getFullYear()) return false;
            } else if (selectedPeriod === 'Personnalisé' && startDate && endDate) {
                if (txDate < new Date(startDate) || txDate > new Date(endDate + 'T23:59:59')) {
                    return false;
                }
            }
            
            // Filtre catégorie
            if (selectedCategory && selectedCategory !== 'Toutes catégories') {
                const key = categoryMap[selectedCategory];
                if (t.category !== key) return false;
            }
            
            return true;
        });
        
        currentPage = 1;
    }
    
    // === AFFICHAGE TABLEAU ===
    function renderTable() {
        if (!transactionsList) return;
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filteredTransactions.slice(start, end);
        
        transactionsList.innerHTML = '';
        
        if (pageItems.length === 0) {
            transactionsList.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding:2rem; color:var(--text-secondary);">
                        Aucune transaction trouvée pour ces filtres.
                    </td>
                </tr>
            `;
            return;
        }
        
        pageItems.forEach(t => {
            const isExpense = t.type === 'expense';
            const icon = categoryIcons[t.category] || '📌';
            const amountSign = isExpense ? '−' : '+';
            const amountClass = isExpense ? 'text-red' : 'text-green';
            const typeName = isExpense ? 'Dépense' : 'Revenu';
            const categoryName = getCategoryName(t.category);
            const categoryClass = getCategoryClass(t.category);
            const formattedDate = formatDate(t.date);
            const formattedAmount = formatAmount(t.amount);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="col-date">${formattedDate}</td>
                <td class="col-libelle">${escapeHtml(t.libelle || t.category)}</td>
                <td class="col-categorie"><span class="cat-tag ${categoryClass}">${icon} ${categoryName}</span></td>
                <td class="col-type">${typeName}</td>
                <td class="col-montant ${amountClass}">${amountSign}${formattedAmount} Ar</td>
            `;
            transactionsList.appendChild(row);
        });
    }
    
    // === MISE À JOUR STATISTIQUES ===
    function updateStats() {
        const total = filteredTransactions.length;
        const revenues = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const net = revenues - expenses;
        const avgExpense = expenses > 0 ? expenses / filteredTransactions.filter(t => t.type === 'expense').length : 0;
        
        if (statResults) statResults.textContent = `${total} transaction${total > 1 ? 's' : ''}`;
        if (statRevenus) statRevenus.textContent = `+${formatAmount(revenues)} Ar`;
        if (statDepenses) statDepenses.textContent = `−${formatAmount(expenses)} Ar`;
        if (statSolde) {
            statSolde.textContent = `${net >= 0 ? '+' : '−'}${formatAmount(Math.abs(net))} Ar`;
            statSolde.className = `stat-value ${net >= 0 ? 'text-green' : 'text-red'}`;
        }
        if (statMoyenne) statMoyenne.textContent = `${formatAmount(avgExpense)} Ar`;
    }
    
    // === PAGINATION ===
    function updatePagination() {
        if (!pageinfo) return;
        
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredTransactions.length);
        
        pageinfo.textContent = `Affichage ${start}–${end} sur ${filteredTransactions.length}`;
        
  
        pageButtons.forEach(btn => {
            if (btn.textContent.includes('Précédent')) {
                btn.classList.toggle('disabled', currentPage === 1);
            } else if (btn.textContent.includes('Suivant')) {
                btn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0);
            }
        });
    }
    
    // === GESTION ÉVÉNEMENTS ===
    function setupEventListeners() {
   
        periodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                periodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                applyFilters();
                renderTable();
                updateStats();
                updatePagination();
                updateActiveFilters();
            });
        });
        
  
        dateInputs.forEach(input => {
            input.addEventListener('change', () => {
                
                if (input.value) {
                    periodBtns.forEach(b => b.classList.remove('active'));
                    document.querySelector('.period-btn:nth-child(4)')?.classList.add('active');
                }
                applyFilters();
                renderTable();
                updateStats();
                updatePagination();
                updateActiveFilters();
            });
        });
        
  
        categorySelect?.addEventListener('change', () => {
            applyFilters();
            renderTable();
            updateStats();
            updatePagination();
            updateActiveFilters();
        });
        
     
        btnReset?.addEventListener('click', () => {
        
            periodBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
           
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            dateInputs[0].value = firstDay.toISOString().split('T')[0];
            dateInputs[1].value = lastDay.toISOString().split('T')[0];
         
            if (categorySelect) categorySelect.value = 'Toutes catégories';
            
            applyFilters();
            renderTable();
            updateStats();
            updatePagination();
            updateActiveFilters();
        });
        
      
        tagCloses.forEach(tag => {
            tag.addEventListener('click', function() {
                this.parentElement.remove();
          
            });
        });
        
        
        pageButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
                if (this.textContent.includes('Précédent') && currentPage > 1) {
                    currentPage--;
                } else if (this.textContent.includes('Suivant') && currentPage < totalPages) {
                    currentPage++;
                }
                renderTable();
                updatePagination();
            });
        });
        
    
        btnExport?.addEventListener('click', exportToCSV);
    }
    

    function updateActiveFilters() {
        if (!activeFilters) return;
        
        
        const label = activeFilters.querySelector('.filter-label-small');
        activeFilters.innerHTML = '';
        if (label) activeFilters.appendChild(label);
        
        const period = document.querySelector('.period-btn.active')?.textContent;
        if (period && period !== 'Mois') {
            addFilterTag(period);
        }
        
        const category = categorySelect?.value;
        if (category && category !== 'Toutes catégories') {
            addFilterTag(category);
        }
        
        const periodCustom = document.querySelector('.period-btn.active')?.textContent === 'Personnalisé';
        if (periodCustom) {
            const [start, end] = Array.from(dateInputs).map(i => i.value);
            if (start && end) {
                addFilterTag(`${formatDateShort(start)} → ${formatDateShort(end)}`);
            }
        }
    }
    
    function addFilterTag(text) {
        if (!activeFilters) return;
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `${escapeHtml(text)} <button class="tag-close">×</button>`;
        activeFilters.appendChild(tag);
        
        tag.querySelector('.tag-close')?.addEventListener('click', function() {
            tag.remove();
         
        });
    }
    
    function exportToCSV() {
        if (filteredTransactions.length === 0) {
            alert('Aucune donnée à exporter.');
            return;
        }
        
        const headers = ['Date', 'Libellé', 'Catégorie', 'Type', 'Montant (Ar)'];
        const rows = filteredTransactions.map(t => [
            t.date,
            `"${(t.libelle || t.category).replace(/"/g, '""')}"`,
            getCategoryName(t.category),
            t.type === 'income' ? 'Revenu' : 'Dépense',
            t.amount.toFixed(2).replace('.', ',')
        ]);
        
        const csvContent = [
            headers.join(';'),
            ...rows.map(r => r.join(';'))
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // === UTILITAIRES ===
    function formatAmount(amount) {
        return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.', ',');
    }
    
    function formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }
    
    function formatDateShort(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit'
        });
    }
    
    function getCategoryName(key) {
        const names = {
            salaire: 'Salaire', business: 'Business', investissement: 'Investissement',
            logement: 'Logement', transport: 'Transport', alimentation: 'Alimentation',
            electricite: 'Électricité', loisirs: 'Loisirs', sante: 'Santé',
            education: 'Éducation', shopping: 'Shopping', autre: 'Autre', revenu: 'Revenu'
        };
        return names[key] || key;
    }
    
    function getCategoryClass(key) {
        const classes = {
            sante: 'cat-sante', alimentation: 'cat-alim', revenu: 'cat-revenu',
            transport: 'cat-transport', loisirs: 'cat-loisirs', logement: 'cat-logement',
            salaire: 'cat-revenu', business: 'cat-revenu', investissement: 'cat-revenu'
        };
        return classes[key] || 'cat-autre';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    

    init();
});