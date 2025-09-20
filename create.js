let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// populate customers dropdown
const customerSelect = document.getElementById("customer");
if (customerSelect) {
  customerSelect.innerHTML = "";
  if (customers.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-- Add customers first --";
    customerSelect.appendChild(option);
  } else {
    customers.forEach(c => {
      const option = document.createElement("option");
      option.value = c.name;
      option.textContent = c.name + (c.business ? ` (${c.business})` : "");
      customerSelect.appendChild(option);
    });
  }
}

// handle invoice submit
const invoiceForm = document.getElementById("invoiceForm");
if (invoiceForm) {
  invoiceForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const customer = document.getElementById("customer").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const deposit = parseFloat(document.getElementById("deposit").value) || 0;
    const date = document.getElementById("date").value;

    let invoiceNum = parseInt(localStorage.getItem("invoiceCounter") || "1", 10);
    const invoice = {
      number: "INV-" + String(invoiceNum).padStart(3, "0"),
      customer,
      amount,
      paid: deposit,
      balance: amount - deposit,
      date,
      status: (amount - deposit) === 0 ? "Paid" : "Unpaid",
      payments: deposit > 0 ? [{ date, amount: deposit }] : []
    };
    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("invoiceCounter", invoiceNum + 1);
    alert("Invoice saved successfully!");
    window.location.href = "index.html";
  });
}
