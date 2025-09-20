let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// helper to compute overdue boolean
function isOverdue(inv) {
  if (!inv.date || inv.balance <= 0) return false;
  const invDate = new Date(inv.date);
  const today = new Date();
  const diffDays = Math.floor((today - invDate) / (1000 * 60 * 60 * 24));
  return diffDays > 30;
}

// render dashboard optionally with search/filter
function renderDashboard(filtered = null) {
  const invoiceList = document.getElementById("invoiceList");
  const moneyIn = document.getElementById("moneyIn");
  const moneyOwed = document.getElementById("moneyOwed");
  if (!invoiceList) return;

  const data = filtered || invoices;
  invoiceList.innerHTML = "";
  let totalIn = 0, totalOwed = 0;

  if (data.length === 0) {
    invoiceList.innerHTML = "<li>No invoices yet</li>";
  }

  data.forEach((inv, index) => {
    totalIn += inv.paid;
    totalOwed += inv.balance;

    const li = document.createElement("li");

    const overdueBadge = (isOverdue(inv) ? `<span class="badge-overdue">⚠️ Overdue</span>` : "");
    const statusLabel = `<strong>[${inv.status}]</strong>`;

    li.innerHTML = `
      <div>
        <strong>${inv.number}</strong> - ${inv.customer}
        ${overdueBadge}
        <div class="meta">| Total: R${inv.amount} | Paid: R${inv.paid} | Balance: R${inv.balance} | (${inv.date}) ${statusLabel}</div>
      </div>
      <div>
        ${inv.balance > 0 ? `<button class="btn btn-green" onclick="addPayment(${index})">💵 Add Payment</button>` : `<button class="btn" disabled>✅ Paid</button>`}
        <button class="btn btn-blue" onclick="viewInvoice(${index})">📄 View</button>
        <button class="btn btn-red" onclick="deleteInvoice(${index})">🗑 Delete</button>
      </div>
    `;
    invoiceList.appendChild(li);
  });

  moneyIn.textContent = "R" + totalIn;
  moneyOwed.textContent = "R" + totalOwed;
}

renderDashboard();

// Add payment (with actual date + optional next due date)
function addPayment(index) {
  const amount = parseFloat(prompt("Enter payment amount:")) || 0;
  if (amount <= 0) return;

  const date = prompt("Enter payment date (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
  if (!date) return;

  const nextDue = prompt("Enter next payment due date (optional, YYYY-MM-DD):") || null;

  if (!invoices[index].payments) invoices[index].payments = [];
  invoices[index].payments.push({ date, amount, nextDue });

  invoices[index].paid += amount;
  invoices[index].balance = Math.max(0, invoices[index].amount - invoices[index].paid);

  if (invoices[index].balance <= 0) invoices[index].status = "Paid";

  localStorage.setItem("invoices", JSON.stringify(invoices));
  alert(`✅ Payment of R${amount} on ${date} recorded!`);
  renderDashboard();
}

// Delete invoice
function deleteInvoice(index) {
  if (!confirm("Are you sure you want to delete this invoice?")) return;
  invoices.splice(index, 1);
  localStorage.setItem("invoices", JSON.stringify(invoices));
  renderDashboard();
}

// view invoice
function viewInvoice(index) {
  localStorage.setItem("selectedInvoice", index);
  window.location.href = "view.html";
}

// export invoices
function exportInvoices() {
  if (!invoices || invoices.length === 0) { alert("No invoices to export."); return; }
  let csv = "Invoice Number,Customer,Amount,Paid,Balance,Date,Status\n";
  invoices.forEach(inv => {
    csv += `${inv.number},${inv.customer},${inv.amount},${inv.paid},${inv.balance},${inv.date},${inv.status}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "invoices.csv";
  link.click();
}

// search + filter
function applySearchFilter() {
  const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();
  const filter = document.getElementById("filterStatus").value;
  const filtered = invoices.filter(inv => {
    const matchSearch = !q || inv.number.toLowerCase().includes(q) || (inv.customer && inv.customer.toLowerCase().includes(q));
    let matchFilter = true;
    if (filter === "paid") matchFilter = inv.status === "Paid";
    if (filter === "unpaid") matchFilter = inv.status !== "Paid";
    if (filter === "overdue") matchFilter = isOverdue(inv);
    return matchSearch && matchFilter;
  });
  renderDashboard(filtered);
}
function clearSearchFilter() {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterStatus").value = "all";
  renderDashboard();
}

// reset invoice numbers (counter only)
function resetInvoiceNumbers() {
  if (!confirm("Reset invoice counter to INV-001? This won't delete invoices.")) return;
  localStorage.setItem("invoiceCounter", 1);
  alert("Invoice counter reset. New invoices will start at INV-001.");
}

// reset ALL demo data
function resetAllData() {
  if (!confirm("Reset ALL data? This will delete all invoices, customers and counters. This cannot be undone.")) return;
  localStorage.removeItem("invoices");
  localStorage.removeItem("customers");
  localStorage.removeItem("invoiceCounter");
  invoices = [];
  customers = [];
  alert("All data cleared.");
  renderDashboard();
}
