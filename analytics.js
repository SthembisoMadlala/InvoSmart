let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

// ================= OVERDUE SUMMARY =================
function renderOverdue() {
  const container = document.getElementById("overdueList");
  if (!container) return;

  const today = new Date();
  const overdue = invoices.filter(inv => {
    if (!inv.date) return false;
    if (inv.balance <= 0) return false;
    const invDate = new Date(inv.date);
    const diffDays = Math.floor((today - invDate) / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  });

  if (overdue.length === 0) {
    container.innerHTML = "<p>No overdue invoices 🎉</p>";
    return;
  }

  container.innerHTML = "<ul>" + overdue.map(inv => `
    <li><strong>${inv.customer}</strong> — ${inv.number} | Balance: R${inv.balance} (Date: ${inv.date})</li>
  `).join("") + "</ul>";
}

// ================= SALES BY MONTH =================
function renderSalesByMonth() {
  const ctx = document.getElementById("salesByMonthChart");
  if (!ctx) return;

  let sales = {};
  invoices.forEach(inv => {
    if (!inv.date) return;
    const month = inv.date.slice(0, 7); // YYYY-MM
    if (!sales[month]) sales[month] = 0;
    sales[month] += inv.amount;
  });

  const labels = Object.keys(sales).sort();
  const data = Object.values(sales);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Sales (R)",
        data,
        backgroundColor: "#00695c"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ================= PAID vs UNPAID =================
function renderPaidVsUnpaid() {
  const ctx = document.getElementById("paidVsUnpaidChart");
  if (!ctx) return;

  let paid = 0, unpaid = 0;
  invoices.forEach(inv => {
    if (inv.status === "Paid") paid++;
    else unpaid++;
  });

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Paid", "Unpaid"],
      datasets: [{
        data: [paid, unpaid],
        backgroundColor: ["#2e7d32", "#c62828"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// ================= TOP CUSTOMERS =================
function renderTopCustomers() {
  const ctx = document.getElementById("topCustomersChart");
  if (!ctx) return;

  let customerTotals = {};
  invoices.forEach(inv => {
    if (!inv.customer) return;
    if (!customerTotals[inv.customer]) customerTotals[inv.customer] = 0;
    customerTotals[inv.customer] += inv.amount;
  });

  const labels = Object.keys(customerTotals);
  const data = Object.values(customerTotals);

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        label: "Total Sales (R)",
        data,
        backgroundColor: [
          "#00695c", "#2e7d32", "#c62828", "#1565c0", "#f9a825"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// ================= RUN ALL =================
renderOverdue();
renderSalesByMonth();
renderPaidVsUnpaid();
renderTopCustomers();

// ================= DOWNLOAD ANALYTICS AS PDF =================
async function downloadAnalyticsPDF() {
  const { jsPDF } = window.jspdf;

  const content = document.getElementById("analyticsContent");
  const canvas = await html2canvas(content, { scale: 2 });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("LegendHub_Analytics.pdf");
}
