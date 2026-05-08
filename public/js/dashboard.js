


document.addEventListener('DOMContentLoaded', () => {

    /* ════════════════════════════════════════
       1. NAVIGATION MOIS
    ════════════════════════════════════════ */

    const MOIS_FR = [
        'Janvier','Février','Mars','Avril','Mai','Juin',
        'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
    ];

    const now = new Date();
    let currentYear  = now.getFullYear();
    let currentMonth = now.getMonth(); // 0-11

    const monthYearEl = document.getElementById('monthYear');
    const prevBtn     = document.getElementById('prevMonth');
    const nextBtn     = document.getElementById('nextMonth');

    function updateMonthDisplay() {
        if (monthYearEl) {
            monthYearEl.textContent = `${MOIS_FR[currentMonth]} ${currentYear}`;
        }
        renderAll();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            updateMonthDisplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            updateMonthDisplay();
        });
    }

    /* ════════════════════════════════════════
       2. UTILITAIRES
    ════════════════════════════════════════ */

    // Formatage Ariary avec option de signe
    function formatAr(n, keepSign = false) {
        const num = parseFloat(n) || 0;
        const formatted = new Intl.NumberFormat('fr-MG', { maximumFractionDigits: 0 })
            .format(Math.abs(num));
        if (keepSign) {
            return (num < 0 ? '−' : num > 0 ? '+' : '') + formatted + ' Ar';
        }
        return formatted + ' Ar';
    }


    function isInCurrentMonth(dateStr) {
        if (!dateStr) return false;
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return false;
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        } catch (e) {
            return false;
        }
    }


    function loadAllTransactions() {
        try {
            const tx = JSON.parse(localStorage.getItem('transactions')) || [];
            const dep = JSON.parse(localStorage.getItem('depenses')) || [];
            
            const normalizeDate = (dateStr) => {
                if (!dateStr) return null;
                const d = new Date(dateStr);
                return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
            };

            const depNorm = dep.map(d => ({
                ...d,
                type: d.type || 'expense',
                category: d.category || 'autre',
                date: normalizeDate(d.date)
            }));
            
            const txNorm = tx.map(t => ({
                ...t,
                date: normalizeDate(t.date)
            }));
            
            return [...txNorm, ...depNorm];
        } catch (e) {
            console.error('❌ Erreur chargement transactions:', e);
            return [];
        }
    }

    function loadGoals() {
        try {
            return JSON.parse(localStorage.getItem('goals')) || [];
        } catch (e) {
            console.error('❌ Erreur chargement objectifs:', e);
            return [];
        }
    }

    function loadExpenses() {
        try {
            return JSON.parse(localStorage.getItem('expenses')) || [];
        } catch (e) {
            console.error('❌ Erreur chargement dépenses à venir:', e);
            return [];
        }
    }

    /* ════════════════════════════════════════
       3. STATS CARDS
    ════════════════════════════════════════ */

    function renderStats(transactions) {
        let revenus = 0, depenses = 0;
        let nbEntrees = 0, nbTransactions = 0;

        transactions.forEach(tx => {
            if (!isInCurrentMonth(tx.date)) return;
            const amt = parseFloat(tx.amount) || 0;
            if (tx.type === 'income' || tx.type === 'revenu') {
                revenus += amt; nbEntrees++;
            } else {
                depenses += amt; nbTransactions++;
            }
        });

        const solde = revenus - depenses;

   
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear  = currentMonth === 0 ? currentYear - 1 : currentYear;
        let prevRev = 0, prevDep = 0;
        
        transactions.forEach(tx => {
            if (!tx.date) return;
            try {
                const d = new Date(tx.date);
                if (isNaN(d.getTime())) return;
                if (d.getMonth() !== prevMonth || d.getFullYear() !== prevYear) return;
                const amt = parseFloat(tx.amount) || 0;
                if (tx.type === 'income' || tx.type === 'revenu') prevRev += amt;
                else prevDep += amt;
            } catch (e) { /* ignore */ }
        });
        const prevSolde = prevRev - prevDep;

        // Affichage Solde
        const soldeAmountEl = document.getElementById('soldeAmount');
        const soldeChangeEl = document.getElementById('soldeChange');
        if (soldeAmountEl) {
            soldeAmountEl.textContent = formatAr(solde, true);
            soldeAmountEl.style.color = solde >= 0 ? '#e0e0e0' : '#ef4444';
        }
        if (soldeChangeEl) {
            if (prevSolde !== 0) {
                const pct = ((solde - prevSolde) / Math.abs(prevSolde) * 100).toFixed(1);
                const sign = pct >= 0 ? '+' : '';
                soldeChangeEl.textContent = `${sign}${pct}% vs mois dernier`;
                soldeChangeEl.className = 'change ' + (pct >= 0 ? 'positive' : 'negative');
            } else {
                soldeChangeEl.textContent = '—';
                soldeChangeEl.className = 'change';
            }
        }

   
        const revAmountEl = document.getElementById('revenusAmount');
        const revChangeEl = document.getElementById('revenusChange');
        if (revAmountEl) revAmountEl.textContent = formatAr(revenus);
        if (revChangeEl) {
            revChangeEl.textContent = nbEntrees === 0
                ? 'Aucune entrée ce mois'
                : `${nbEntrees} entrée${nbEntrees > 1 ? 's' : ''} ce mois`;
        }

  
        const depAmountEl = document.getElementById('depensesAmount');
        const depChangeEl = document.getElementById('depensesChange');
        if (depAmountEl) depAmountEl.textContent = formatAr(depenses);
        if (depChangeEl) {
            depChangeEl.textContent = nbTransactions === 0
                ? 'Aucune transaction'
                : `${nbTransactions} transaction${nbTransactions > 1 ? 's' : ''}`;
        }

        return { revenus, depenses, solde };
    }

    /* ════════════════════════════════════════
       4. PIE CHART
    ════════════════════════════════════════ */

    const CATEGORY_CONFIG = {
        logement:     { label: 'Logement',    color: '#5B7FD4' },
        transport:    { label: 'Transport',    color: '#1BC47D' },
        loisirs:      { label: 'Loisirs',      color: '#FFA500' },
        alimentation: { label: 'Alimentation', color: '#9B59B6' },
        santé:        { label: 'Santé',        color: '#E74C3C' },
        education:    { label: 'Éducation',    color: '#3498DB' },
        autre:        { label: 'Autre',        color: '#8B96A8' },
    };

    function getCategoryConf(catKey) {
        const k = (catKey || 'autre').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if (k.includes('log') || k.includes('loyer') || k.includes('maison')) return CATEGORY_CONFIG.logement;
        if (k.includes('trans') || k.includes('voiture') || k.includes('bus'))  return CATEGORY_CONFIG.transport;
        if (k.includes('lois') || k.includes('sport') || k.includes('divert'))  return CATEGORY_CONFIG.loisirs;
        if (k.includes('alim') || k.includes('nourriture') || k.includes('repas') || k.includes('epice')) return CATEGORY_CONFIG.alimentation;
        if (k.includes('sant') || k.includes('medic') || k.includes('pharma'))  return CATEGORY_CONFIG.santé;
        if (k.includes('educ') || k.includes('ecole') || k.includes('cours'))   return CATEGORY_CONFIG.education;
        return CATEGORY_CONFIG[k] || CATEGORY_CONFIG.autre;
    }

    let pieChartInstance = null;

    function renderPieChart(transactions) {
        const canvas = document.getElementById('pieChart');
        if (!canvas) return;

        const catMap = {};
        transactions.forEach(tx => {
            if (!isInCurrentMonth(tx.date)) return;
            if (tx.type === 'income' || tx.type === 'revenu') return;
            const cat = (tx.category || 'autre').toLowerCase();
            const amt = parseFloat(tx.amount) || 0;
            catMap[cat] = (catMap[cat] || 0) + amt;
        });

        const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        const legendEl = document.getElementById('chartLegend');

        if (entries.length === 0) {
            if (pieChartInstance) { pieChartInstance.destroy(); pieChartInstance = null; }
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#a0a0a0';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Aucune dépense ce mois', canvas.width / 2, canvas.height / 2);
            if (legendEl) legendEl.innerHTML = '<p style="color:#a0a0a0;font-size:13px;text-align:center">Aucune donnée</p>';
            return;
        }

        const labels = entries.map(([k]) => getCategoryConf(k).label);
        const data   = entries.map(([, v]) => v);
        const colors = entries.map(([k]) => getCategoryConf(k).color);

        if (pieChartInstance) pieChartInstance.destroy();

        pieChartInstance = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderColor: '#1e1e28',
                    borderWidth: 3,
                    hoverOffset: 8,
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: (ctx) => ` ${ctx.label} : ${formatAr(ctx.raw)}` },
                        backgroundColor: '#2d2d33',
                        titleColor: '#e0e0e0',
                        bodyColor: '#a0a0a0',
                        borderColor: '#424249',
                        borderWidth: 1,
                    }
                },
                animation: { animateScale: true, animateRotate: true, duration: 600 }
            }
        });

        if (legendEl) {
            legendEl.innerHTML = entries.map(([k, v]) => {
                const conf = getCategoryConf(k);
                return `<div class="legend-item">
                    <span class="legend-color" style="background-color:${conf.color};"></span>
                    <span>${conf.label}</span>
                    <span class="amount">${formatAr(v)}</span>
                </div>`;
            }).join('');
        }
    }

    /* ════════════════════════════════════════
       5. À VENIR CETTE SEMAINE - 
    ════════════════════════════════════════ */

    function renderUpcoming(expenses) {
        const upcomingList = document.getElementById('upcomingList');
        if (!upcomingList) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const upcoming = expenses
            .filter(tx => {
                if (tx.type === 'income' || tx.type === 'revenu') return false;
                if (!tx.date) return false;
                try {
                    const d = new Date(tx.date);
                    if (isNaN(d.getTime())) return false;
                    d.setHours(0, 0, 0, 0);
                    return d >= today && d <= endOfWeek;
                } catch (e) {
                    return false;
                }
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (upcoming.length === 0) {
            upcomingList.innerHTML = '<p style="color:#a0a0a0;font-size:13px;text-align:center;padding:12px 0">Aucune dépense prévue cette semaine</p>';
            return;
        }

        const DOT_COLORS = ['#5B7FD4','#1BC47D','#FFA500','#9B59B6','#E74C3C'];
        
        
        upcomingList.innerHTML = upcoming.map((tx, i) => {
            const txDate = new Date(tx.date);
            const diffDays = Math.round((txDate - today) / 86400000);
            const diffLabel = diffDays === 0 ? "aujourd'hui" : diffDays === 1 ? 'demain' : `dans ${diffDays} jours`;
            const dateStr = txDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            const color = DOT_COLORS[i % DOT_COLORS.length];
            const label = tx.description || tx.category || 'Dépense';
            const amount = parseFloat(tx.amount) || 0;

            return `<div class="upcoming-item">
                <div class="item-left">
                    <span class="dot" style="background-color:${color};width:8px;height:8px;border-radius:50%;display:inline-block;"></span>
                    <div class="item-info" style="margin-left:8px;">
                        <p style="margin:0;font-size:13px;color:#e0e0e0;">${label}</p>
                        <span class="date" style="font-size:11px;color:#8a92a8;">${dateStr} · ${diffLabel}</span>
                    </div>
                </div>
                <p class="amount negative" style="margin:0;font-weight:600;color:#ef4444;">−${formatAr(amount)}</p>
            </div>`;
        }).join('');
    }

    /* ════════════════════════════════════════
       6. OBJECTIFS
    ════════════════════════════════════════ */

    function renderObjectives(goals) {
        const objCard = document.querySelector('.objectives-card');
        if (!objCard) return;

        const h3 = objCard.querySelector('h3');
        objCard.innerHTML = '';
        if (h3) objCard.appendChild(h3);

        if (!goals || goals.length === 0) {
            const empty = document.createElement('p');
            empty.style.cssText = 'color:#a0a0a0;font-size:13px;text-align:center;padding:16px 0';
            empty.textContent = 'Aucun objectif enregistré';
            objCard.appendChild(empty);
            return;
        }

        goals.forEach(g => {
            const current = parseFloat(g.current || g.saved || g.montantActuel || 0);
            const target  = parseFloat(g.target  || g.amount || g.montantCible  || 1);
            const pct     = Math.min(100, Math.round((current / target) * 100));
            const name    = g.name || g.title || g.nom || 'Objectif';

            const div = document.createElement('div');
            div.className = 'objective-item';
            div.innerHTML = `
                <div class="objective-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <p class="objective-title" style="margin:0;font-size:13px;color:#e0e0e0;">${name}</p>
                    <span class="percentage" style="font-size:12px;color:#6ba0ff;">${pct}%</span>
                </div>
                <div class="progress-bar" style="height:6px;background:#2d2d33;border-radius:3px;overflow:hidden;">
                    <div class="progress-fill" style="height:100%;background:linear-gradient(90deg,#6ba0ff,#5B7FD4);width:0%;transition:width 0.4s ease;"></div>
                </div>
                <p class="objective-text" style="margin:8px 0 0;font-size:11px;color:#8a92a8;">${formatAr(current)} sur ${formatAr(target)}</p>`;
            objCard.appendChild(div);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    const fill = div.querySelector('.progress-fill');
                    if (fill) fill.style.width = pct + '%';
                }, 50);
            });
        });
    }

    /* ════════════════════════════════════════
       7. TOUTES LES TRANSACTIONS DU MOIS
    ════════════════════════════════════════ */

    function renderAllTransactions(transactions) {
        const container = document.getElementById('allTransactionsList');
        if (!container) return;

        const monthTx = transactions
            .filter(tx => isInCurrentMonth(tx.date))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (monthTx.length === 0) {
            container.innerHTML = '<p style="color:#a0a0a0;font-size:13px;text-align:center;padding:16px 0">Aucune transaction ce mois</p>';
            return;
        }

        container.innerHTML = monthTx.map(tx => {
            const isRevenu  = tx.type === 'income' || tx.type === 'revenu';
            const amt       = parseFloat(tx.amount) || 0;
            const sign      = isRevenu ? '+' : '−';
            const color     = isRevenu ? '#1bc47d' : '#ef4444';
            const label     = tx.description || tx.category || (isRevenu ? 'Revenu' : 'Dépense');
            const cat       = tx.category || '';
            const dateStr   = tx.date ? new Date(tx.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }) : '—';
            const conf      = getCategoryConf(cat);

            return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #424249;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="width:10px;height:10px;border-radius:50%;background:${isRevenu ? '#1bc47d' : conf.color};display:inline-block;flex-shrink:0;"></span>
                    <div>
                        <p style="font-size:13px;font-weight:500;color:#e0e0e0;margin:0;">${label}</p>
                        <span style="font-size:11px;color:#8a92a8;">${dateStr}${cat ? ' · ' + (conf.label || cat) : ''}</span>
                    </div>
                </div>
                <span style="font-weight:600;font-size:13px;color:${color};">${sign}${formatAr(amt)}</span>
            </div>`;
        }).join('');

        const items = container.querySelectorAll('div[style*="border-bottom"]');
        if (items.length > 0) items[items.length - 1].style.borderBottom = 'none';
    }

    /* ════════════════════════════════════════
       8. SALUTATION DYNAMIQUE
    ════════════════════════════════════════ */

    function renderGreeting() {
        const el = document.getElementById('greetingText');
        if (!el) return;
        const h = new Date().getHours();
        el.textContent = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
    }

    /* ════════════════════════════════════════
       9. RENDER ALL
    ════════════════════════════════════════ */

    function renderAll() {
        const transactions = loadAllTransactions();
        const goals        = loadGoals();
        const expenses     = loadExpenses();


        renderGreeting();
        renderStats(transactions);
        renderPieChart(transactions);
        renderObjectives(goals);
        renderAllTransactions(transactions);
        renderUpcoming(expenses);
    }

    /* ════════════════════════════════════════
       10. INIT
    ════════════════════════════════════════ */

    updateMonthDisplay();


    window.addEventListener('storage', (e) => {
        if (['transactions', 'goals', 'depenses', 'expenses'].includes(e.key)) {
            renderAll();
        }
    });

    window.refreshDashboard = renderAll;
});