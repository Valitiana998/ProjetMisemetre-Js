document.addEventListener('DOMContentLoaded', () => {
  const mois = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  let currentDate = new Date();

  const monthYearDisplay = document.getElementById("monthYear");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  function updateDisplay() {
    if (monthYearDisplay) {
      const monthName = mois[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      monthYearDisplay.textContent = `${monthName} ${year}`;
    }
  }

  // Vérification avant d'ajouter l'écouteur d'événement
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateDisplay();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateDisplay();
    });
  }

  updateDisplay();
});