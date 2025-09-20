let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
const invoiceIndex = localStorage.getItem("selectedInvoice");

if (invoiceIndex !== null) {
  const inv = invoices[invoiceIndex];
  const container = document.getElementById("invoiceDetails");

  if (inv && container) {
    container.innerHTML = `
      <div class="invoice-header">
        <h2>InvoSmart</h2>
        <p>Smart Invoicing & Payment Tracking</p>
        <p>34 Market street Mooi River</p>
        <p>📞 +27 81 347 5668 | ✉️ djlegendza@gmail.com</p>
        <h3>Invoice ${inv.number}</h3>
      </div>

      <div class="invoice-details">
        <p><strong>Customer Name:</strong> ${inv.customer}</p>
        <p><strong>Date:</strong> ${inv.date}</p>
      </div>

      <table class="invoice-table">
        <thead>
          <tr><th>Description</th><th>Amount (R)</th></tr>
        </thead>
        <tbody>
          <tr><td>Total Amount</td><td>R${inv.amount}</td></tr>
          <tr><td>Deposit / Paid</td><td>R${inv.paid}</td></tr>
          <tr><td><strong>Balance</strong></td><td><strong>R${inv.balance}</strong></td></tr>
        </tbody>
      </table>

      <h3>Payment History</h3>
      <ul>
        ${inv.payments && inv.payments.length > 0 
          ? inv.payments.map(p => `
              <li>
                R${p.amount} — Paid on ${p.date}
                ${p.nextDue ? `<em>(Next due: ${p.nextDue})</em>` : ""}
              </li>`).join("")
          : "<li>No payments yet</li>"}
      </ul>
    `;
  }
}
