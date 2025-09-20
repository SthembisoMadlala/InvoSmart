let customers = JSON.parse(localStorage.getItem("customers")) || [];

const form = document.getElementById("customerForm");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const cust = {
      id: Date.now(),
      name: document.getElementById("custName").value,
      phone: document.getElementById("custPhone").value,
      email: document.getElementById("custEmail").value,
      business: document.getElementById("custBusiness").value
    };
    customers.push(cust);
    localStorage.setItem("customers", JSON.stringify(customers));
    alert("Customer saved");
    renderCustomers();
    form.reset();
  });
}

function renderCustomers() {
  const list = document.getElementById("customerList");
  if (!list) return;
  list.innerHTML = "";
  if (customers.length === 0) {
    list.innerHTML = "<li>No customers yet.</li>";
    return;
  }
  customers.forEach((cust, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${cust.name}</strong> ${cust.business ? `(${cust.business})` : ""}
        <div class="meta">📞 ${cust.phone || "-"} | ✉️ ${cust.email || "-"}</div>
      </div>
      <div>
        <button class="btn btn-blue" onclick="editCustomer(${cust.id})">Edit</button>
        <button class="btn btn-red" onclick="deleteCustomer(${idx})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function deleteCustomer(index) {
  if (!confirm("Delete this customer?")) return;
  customers.splice(index, 1);
  localStorage.setItem("customers", JSON.stringify(customers));
  renderCustomers();
}

function editCustomer(id) {
  const cust = customers.find(c => c.id === id);
  if (!cust) return;
  document.getElementById("custName").value = cust.name;
  document.getElementById("custPhone").value = cust.phone;
  document.getElementById("custEmail").value = cust.email;
  document.getElementById("custBusiness").value = cust.business;
  // remove old record to replace on save
  const idx = customers.indexOf(cust);
  if (idx > -1) customers.splice(idx, 1);
  localStorage.setItem("customers", JSON.stringify(customers));
}

function exportCustomers() {
  if (!customers || customers.length === 0) { alert("No customers to export."); return; }
  let csv = "Name,Business,Phone,Email\n";
  customers.forEach(c => {
    csv += `${c.name},${c.business || ""},${c.phone || ""},${c.email || ""}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "customers.csv";
  link.click();
}

renderCustomers();
