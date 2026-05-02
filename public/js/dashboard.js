// Dashboard Charts and Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize pie chart for expense distribution
    if (typeof Chart !== 'undefined') {
        createPieChart();
        createLineChart();
    }

    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    quickActionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Upcoming events click handlers
    const upcomingItems = document.querySelectorAll('.upcoming-item');
    upcomingItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('Viewing upcoming item...');
        });
    });
});

// Create expense distribution pie chart
function createPieChart() {
    const pieChartElement = document.getElementById('pieChart');
    if (pieChartElement && pieChartElement.getContext) {
        const ctx = pieChartElement.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Logement', 'Transport', 'Loisirs', 'Alimentation', 'Autre'],
                datasets: [{
                    data: [470000, 210000, 158000, 126000, 86000],
                    backgroundColor: [
                        '#6ba0ff',
                        '#1bc47d',
                        '#FFA500',
                        '#9B59B6',
                        '#8B96A8'
                    ],
                    borderColor: '#2d2d33',
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed.toLocaleString('fr-FR') + ' Ar';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Create line chart for income vs expenses
function createLineChart() {
    const ctx = document.getElementById('trendsChart');
    if (ctx && ctx.getContext) {
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                datasets: [
                    {
                        label: 'Revenus',
                        data: [400000, 350000, 380000, 370000],
                        borderColor: '#1bc47d',
                        backgroundColor: 'rgba(27, 196, 125, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Dépenses',
                        data: [320000, 280000, 250000, 200000],
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
                    y: {
                        ticks: {
                            color: '#a0a0a0',
                            callback: function(value) {
                                return (value / 1000) + 'k';
                            }
                        },
                        grid: {
                            color: '#424249'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a0a0a0'
                        },
                        grid: {
                            color: '#424249'
                        }
                    }
                }
            }
        });
    }
}

// Handle quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'add-transaction':
            window.location.href = 'addTransaction.html';
            break;
        case 'add-goal':
            window.location.href = 'addObjectif.html';
            break;
        case 'view-budget':
            window.location.href = 'budget.html';
            break;
        case 'view-reports':
            window.location.href = 'reports.html';
            break;
        default:
            console.log('Action:', action);
    }
}

// Refresh dashboard data
function refreshDashboard() {
    console.log('Refreshing dashboard...');
    location.reload();
}
