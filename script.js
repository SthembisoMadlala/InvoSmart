// Add Payment button
let paymentBtn = "";
if (inv.balance > 0) {
  paymentBtn = `<button onclick="addPayment(${index})" class="btn btn-green">💵 Add Payment</button>`;
} else {
  paymentBtn = `<button class="btn btn-green" disabled>✅ Paid</button>`;
}

// Invoice list item
li.innerHTML = `
  <strong>${inv.number}</strong> - ${inv.customer} | Total: R${inv.amount} | 
  Paid: R${inv.paid} | Balance: R${inv.balance} (${inv.date}) 
  <strong>[${inv.status}]</strong>
  ${paymentBtn}
  <button onclick="viewInvoice(${index})" class="btn btn-blue">👁️ View</button>
  <button onclick="deleteInvoice(${index})" class="btn btn-red">🗑️ Delete</button>
`;
