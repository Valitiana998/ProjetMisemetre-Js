document.addEventListener('DOMContentLoaded', function() {
    // 📦 Données centrales (état de l'application)
    let expensesData = [
        { id: 1, title: 'Loyer appartement', category: 'Logement', frequency: 'Mensuel', paymentMethod: 'Prélèvement automatique', amount: -600000, date: '2026-05-02' },
        { id: 2, title: 'Netflix', category: 'Loisirs', frequency: 'Mensuel', paymentMethod: 'Carte bancaire', amount: -32000, date: '2026-05-05' },
        { id: 3, title: 'Crédit voiture', category: 'Dette', frequency: 'Mensuel', paymentMethod: '18/36 échéances', amount: -180000, date: '2026-05-07' },
        { id: 4, title: 'Spotify', category: 'Loisirs', frequency: 'Mensuel', paymentMethod: 'Carte bancaire', amount: -25000, date: '2026-05-15' },
        { id: 5, title: 'Internet Telma', category: 'Logement', frequency: 'Mensuel', paymentMethod: 'Prélèvement automatique', amount: -120000, date: '2026-05-20' }
    ];

    // 1️⃣ CRÉATION DU FORMULAIRE (injecté dynamiquement)
    function initForm() {
        const main = document.querySelector('.main-content');
        if (!main) return;

        const formWrapper = document.createElement('div');
        formWrapper.id = 'form-container';
        formWrapper.style.marginTop = '2rem';

        formWrapper.innerHTML = `
            <h2 style="color:#fff; margin-bottom:1rem;">➕ Nouvelle charge</h2>
            <form id="chargeForm" style="background:#1e1e2e; padding:1.5rem; border-radius:8px; display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                <div>
                    <label style="display:block; color:#888; margin-bottom:0.3rem; font-size:0.85rem;">Titre *</label>
                    <input type="text" id="f-title" required style="width:100%; padding:0.6rem; background:#12121c; border:1px solid #333; color:#fff; border-radius:4px;">
                </div>
                <div>
                    <label style="display:block; color:#888; margin-bottom:0.3rem; font-size:0.85rem;">Montant (Ar) *</label>
                    <input type="number" id="f-amount" required min="1" style="width:100%; padding:0.6rem; background:#12121c; border:1px solid #333; color:#fff; border-radius:4px;">
                </div>
                <div>
                    <label style="display:block; color:#888; margin-bottom:0.3rem; font-size:0.85rem;">Date *</label>
                    <input type="date" id="f-date" required style="width:100%; padding:0.6rem; background:#12121c; border:1px solid #333; color:#fff; border-radius:4px;">
                </div>
                <div>
                    <label style="display:block; color:#888; margin-bottom:0.3rem; font-size:0.85rem;">Catégorie *</label>
                    <select id="f-category" required style="width:100%; padding:0.6rem; background:#12121c; border:1px solid #333; color:#fff; border-radius:4px;">
                        <option value="">Sélectionner...</option>
                        <option value="Logement">Logement</option>
                        <option value="Loisirs">Loisirs</option>
                        <option value="Transport">Transport</option>
                        <option value="Dette">Dette</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; color:#888; margin-bottom:0.3rem; font-size:0.85rem;">Fréquence *</label>
                    <select id="f-frequency" required style="width:100%; padding:0.6rem; background:#12121c; border:1px solid #333; color:#fff; border-radius:4px;">
                        <option value="Mensuel">Mensuel</option>
                        <option value="Annuel">Annuel</option>
                        <option value="Hebdomadaire">Hebdomadaire</option>
                        <option value="Unique">Unique</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; color:#888; margin-bottom:0.3rem; font-size:0.85rem;">Mode de paiement *</label>
                    <select id="f-payment" required style="width:100%; padding:0.6rem; background:#12121c; border:1px solid #333; color:#fff; border-radius:4px;">
                        <option value="Prélèvement automatique">Prélèvement automatique</option>
                        <option value="Carte bancaire">Carte bancaire</option>
                        <option value="Virement">Virement</option>
                        <option value="Espèces">Espèces</option>
                    </select>
                </div>
                <div style="grid-column: 1 / -1; display:flex; gap:1rem; margin-top:0.5rem;">
                    <button type="submit" style="background:#8b5cf6; color:#fff; border:none; padding:0.7rem 1.5rem; border-radius:4px; cursor:pointer; font-weight:500;">Enregistrer</button>
                    <button type="reset" style="background:#333; color:#ccc; border:none; padding:0.7rem 1.5rem; border-radius:4px; cursor:pointer;">Effacer</button>
                </div>
            </form>
        `;

        main.appendChild(formWrapper);
    }

    // 2️⃣ GESTION DE LA SOUMISSION & VALIDATION
    function setupFormHandler() {
        const form = document.getElementById('chargeForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const title = document.getElementById('f-title').value.trim();
            const amount = parseFloat(document.getElementById('f-amount').value);
            const date = document.getElementById('f-date').value;
            const category = document.getElementById('f-category').value;
            const frequency = document.getElementById('f-frequency').value;
            const paymentMethod = document.getElementById('f-payment').value;

            // Validation stricte
            if (!title || isNaN(amount) || amount <= 0 || !date || !category || !frequency || !paymentMethod) {
                alert('⚠️ Tous les champs sont obligatoires et le montant doit être > 0.');
                return;
            }

            // Création de l'objet
            const newCharge = {
                id: Date.now(),
                title,
                amount: -Math.abs(amount), // Toujours négatif (dépense)
                date,
                category,
                type: category,
                frequency,
                paymentMethod
            };

            // Mise à jour de l'état
            expensesData.push(newCharge);
            expensesData.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Re-rendu
            renderTimeline();
            updateSummary();

            // Reset + feedback
            form.reset();
            alert('✅ Charge ajoutée et liste mise à jour.');
        });
    }

    // 3️⃣ RENDU DE LA TIMELINE
    function renderTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = expensesData.map(exp => {
            const days = getDaysRemaining(exp.date);
            const fDate = new Date(exp.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase();
            const fAmount = exp.amount.toLocaleString('fr-FR') + ' Ar';

            return `
                <div class="timeline-item ${exp.category.toLowerCase()}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${fDate}</div>
                    <div class="timeline-content">
                        <div class="timeline-title">${exp.title}</div>
                        <div class="timeline-meta">${exp.category} · ${exp.frequency} · ${exp.paymentMethod}</div>
                        <div class="timeline-days">${days}</div>
                    </div>
                    <div class="timeline-amount">${fAmount}</div>
                </div>
            `;
        }).join('');
    }

    // 4️⃣ MISE À JOUR DES CARTES RÉSUMÉ
    function updateSummary() {
        const total = expensesData.reduce((sum, e) => sum + Math.abs(e.amount), 0);
        const count = expensesData.length;
        const today = new Date();
        const next = expensesData.find(e => new Date(e.date) >= today);

        document.querySelector('.card:nth-child(1) .card-value').textContent = `−${total.toLocaleString('fr-FR')} Ar`;
        document.querySelector('.card:nth-child(1) .card-subtitle').textContent = `${count} prélèvements`;

        if (next) {
            const nextDate = new Date(next.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            document.querySelector('.card:nth-child(2) .card-value').textContent = next.title.split(' ')[0];
            document.querySelector('.card:nth-child(2) .card-subtitle').textContent = `${nextDate} · ${getDaysRemaining(next.date)}`;
        }

        // Solde projeté (base exemple : 1 557 000 Ar)
        const base = 1557000;
        const projected = base - total;
        const bal = document.querySelector('.card:nth-child(3) .card-value');
        bal.textContent = (projected >= 0 ? '+' : '') + projected.toLocaleString('fr-FR') + ' Ar';
        bal.style.color = projected >= 0 ? '#10b981' : '#ef4444';
    }

    // 5️⃣ UTILITAIRE : JOURS RESTANTS
    function getDaysRemaining(dateStr) {
        const now = new Date(); now.setHours(0,0,0,0);
        const target = new Date(dateStr); target.setHours(0,0,0,0);
        const diff = Math.ceil((target - now) / 86400000);
        if (diff < 0) return 'Passé';
        if (diff === 0) return "Aujourd'hui";
        if (diff === 1) return 'Dans 1 jour';
        return `Dans ${diff} jours`;
    }

    // 🚀 INITIALISATION
    initForm();
    setupFormHandler();
    renderTimeline();
    updateSummary();
});