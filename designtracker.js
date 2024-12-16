// assigning the main elements involved in the application as constants.Selectors
const balanceElement = document.getElementById("balance");
const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const transactionListElement = document.getElementById("transaction-list");
const transactionForm = document.getElementById("tracker-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

//persistent data(that is ensuring that added transactions remain on the website local storage when closed)
let transactions = JSON.parse(localStorage.getItem("transactions"))||  [];

// Update summary(section containing balance and other transaction info). this outlines the filter options to indicate increment or decrement and to indicate whether an income or expense
function updateSummary() {
    const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income + expenses;

    balanceElement.textContent = balance.toFixed(2);
    totalIncomeElement.textContent = income.toFixed(2);
    totalExpensesElement.textContent = Math.abs(expenses).toFixed(2);
}

// Render Transactions- this is to create an html object for each transaction
function renderTransactions() {
    transactionListElement.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add(transaction.amount > 0 ? "income" : "expense");
        li.innerHTML = `
            ${transaction.description}: $${transaction.amount.toFixed(2)}
            <button onclick="deleteTransaction(${index})" style="float:right;">X</button>
        `;
        transactionListElement.appendChild(li);
    });
}

// Add Transaction.function to create a new transaction to the local storage.
transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!description || isNaN(amount)) {
        alert("Please enter valid details.");
        return;
    }

    transactions.push({ description, amount });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    descriptionInput.value = "";
    amountInput.value = "";

    updateSummary();
    renderTransactions();
});

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateSummary();
    renderTransactions();
}

// Initialize. to set up the main code functions
updateSummary();
renderTransactions();