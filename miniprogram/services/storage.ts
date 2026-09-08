import { isInCurrentMonth } from "../utils/date";

const STORAGE_KEY = "life9_state_v001";

function emptyState() {
  return {
    version: 1,
    transactions: []
  };
}

function normalizeState(raw) {
  if (!raw || typeof raw !== "object") {
    return emptyState();
  }

  return {
    version: 1,
    settings: raw.settings,
    transactions: Array.isArray(raw.transactions) ? raw.transactions : []
  };
}

export function getState() {
  return normalizeState(wx.getStorageSync(STORAGE_KEY));
}

export function saveState(state) {
  wx.setStorageSync(STORAGE_KEY, normalizeState(state));
}

export function getSettings() {
  return getState().settings;
}

export function saveSettings(settings) {
  const state = getState();
  state.settings = {
    monthlyIncomeCents: settings.monthlyIncomeCents,
    currentSavingsCents: settings.currentSavingsCents,
    budgetMode: settings.budgetMode,
    updatedAt: new Date().toISOString()
  };
  saveState(state);
}

export function listTransactions() {
  return getState().transactions.slice().sort((a, b) => {
    const left = `${b.date || ""} ${b.createdAt || ""}`;
    const right = `${a.date || ""} ${a.createdAt || ""}`;
    return left.localeCompare(right);
  });
}

export function listCurrentMonthTransactions() {
  return listTransactions().filter((transaction) => isInCurrentMonth(transaction.date));
}

export function addTransaction(input) {
  const state = getState();
  const transaction = {
    id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    amountCents: input.amountCents,
    accountKey: input.accountKey,
    note: input.note || "",
    date: input.date,
    createdAt: new Date().toISOString()
  };

  state.transactions.push(transaction);
  saveState(state);
  return transaction;
}

export function deleteTransaction(id) {
  const state = getState();
  state.transactions = state.transactions.filter((transaction) => transaction.id !== id);
  saveState(state);
}

export function clearAllData() {
  wx.removeStorageSync(STORAGE_KEY);
}
