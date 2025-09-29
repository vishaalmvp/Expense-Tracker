// Trigger update for GitHub Pages case-sensitive rename
// Elements
const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const transactionList = document.getElementById("transaction-list");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const currentMonthElem = document.getElementById("current-month");
const addIncomeBtn = document.getElementById("add-income");
const addExpenseBtn = document.getElementById("add-expense");
const refreshBtn = document.getElementById("refresh-btn");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const showHistoryBtn = document.getElementById("show-history");
const toggleModeBtn = document.getElementById("toggle-mode");

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let transactionsByMonth = {}; 
let currentDate = new Date();

// Show current month
function showCurrentMonth() { currentMonthElem.innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`; }
showCurrentMonth();

// Generate random ID
function generateID() { return Math.floor(Math.random() * 100000); }

// Add transaction
function addTransaction(type){
  if(text.value.trim() === '' || amount.value.trim() === '') return;

  let amt = +amount.value;
  if(type === 'expense') amt = -Math.abs(amt);

  const transaction = { id: generateID(), text: text.value, amount: amt };
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  if(!transactionsByMonth[monthKey]) transactionsByMonth[monthKey] = [];
  transactionsByMonth[monthKey].push(transaction);

  init();
  text.value = '';
  amount.value = '';
}

// Remove transaction
function removeTransaction(id){
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  transactionsByMonth[monthKey] = transactionsByMonth[monthKey].filter(t => t.id !== id);
  init();
}

// Initialize month view
function init(){
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const transactions = transactionsByMonth[monthKey] || [];
  transactionList.innerHTML = '';
  transactions.forEach(t => addTransactionDOM(t));
  updateValues(transactions);
}

// Add transaction to DOM
function addTransactionDOM(transaction){
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
    <button onclick="removeTransaction(${transaction.id})">x</button>
  `;
  transactionList.appendChild(item);
}

// Update balance, income, expense
function updateValues(transactions){
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts.filter(a => a > 0).reduce((acc, a) => acc + a, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, a) => acc + a, 0);

  balance.innerText = `₹${total.toFixed(2)}`;
  moneyPlus.innerText = `₹${income.toFixed(2)}`;
  moneyMinus.innerText = `₹${Math.abs(expense).toFixed(2)}`;
}

// Event Listeners
addIncomeBtn.addEventListener("click", () => addTransaction('income'));
addExpenseBtn.addEventListener("click", () => addTransaction('expense'));
refreshBtn.addEventListener("click", () => { const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`; transactionsByMonth[monthKey] = []; init(); });
prevMonthBtn.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() - 1); showCurrentMonth(); init(); });
nextMonthBtn.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() + 1); showCurrentMonth(); init(); });
showHistoryBtn.addEventListener("click", () => { alert(JSON.stringify(transactionsByMonth, null, 2)); });

// Dark/Light Mode Toggle
toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  toggleModeBtn.innerText = document.body.classList.contains("dark-mode") ? "☀ Light Mode" : "🌙 Dark Mode";
});

init();
