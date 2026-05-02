// Reports and Analytics Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        createReportsCharts();
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.report-filters button, .filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period') || this.textContent;
            console.log('Filter by period:', period);
            updateReports(period);
        });
    });

    // Export report
    const exportBtn = document.querySelector('.export-btn') || document.querySelector('button:has-text("Exporter")');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            console.log('Exporting report...');
            alert('Export du rapport (à implémenter)');
        });
    }

    // Print report
    const printBtn = document.querySelector('.print-btn') || document.querySelector('button:has-text("Imprimer")');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
});

// Create charts for reports
function createReportsCharts() {
    // Expense by category chart
    const expenseCategoryCtx = document.querySelector('canvas')?.getContext('2d');
    if (expenseCategoryCtx) {
        new Chart(expenseCategoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Logement', 'Transport', 'Alimentation', 'Loisirs', 'Autre'],
                datasets: [{
                    data: [470000, 210000, 225000, 158000, 86000],
                    backgroundColor: [
                        '#6ba0ff',
                        '#1bc47d',
                        '#FFA500',
                        '#9B59B6',
                        '#8B96A8'
                    ],
                    borderColor: '#2d2d33',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0'
                        }
                    }
                }
            }
        });
    }

    // Monthly trends chart
    const trendsCtx = document.querySelectorAll('canvas')[1]?.getContext('2d');
    if (trendsCtx) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                datasets: [
                    {
                        label: 'Revenus',
                        data: [1500000, 1550000, 1500000, 1600000, 1700000, 1750000],
                        borderColor: '#1bc47d',
                        backgroundColor: 'rgba(27, 196, 125, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Dépenses',
                        data: [1200000, 1150000, 1300000, 1050000, 1100000, 1080000],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0'
                        }
                    }
                },
                scales: {
                    ticks: {
                        color: '#a0a0a0'
                    },
                    grid: {
                        color: '#424249'
                    }
                }
            }
        });
    }
}

// Update reports based on selected period
function updateReports(period) {
    console.log('Updating reports for period:', period);
    // TODO: Fetch data for selected period and update charts and stats
}
