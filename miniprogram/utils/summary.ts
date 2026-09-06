import { ACCOUNT_DEFINITIONS } from "../constants/budget";
import { calculateAccountBudgets, getPlanSavingsBudget } from "./budget";

export function summarizeTransactions(transactions) {
  const usedByAccount = {};
  ACCOUNT_DEFINITIONS.forEach((account) => {
    usedByAccount[account.key] = 0;
  });

  const totalSpentCents = transactions.reduce((sum, transaction) => {
    const amount = Math.max(0, Number(transaction.amountCents) || 0);
    if (usedByAccount[transaction.accountKey] === undefined) {
      usedByAccount[transaction.accountKey] = 0;
    }
    usedByAccount[transaction.accountKey] += amount;
    return sum + amount;
  }, 0);

  return {
    totalSpentCents,
    usedByAccount
  };
}

export function buildDashboard(settings, transactions) {
  const summary = summarizeTransactions(transactions);
  const budgets = calculateAccountBudgets(settings.monthlyIncomeCents, settings.budgetMode);
  const planSavings = getPlanSavingsBudget(settings.monthlyIncomeCents, settings.budgetMode);

  return {
    monthlyIncomeCents: settings.monthlyIncomeCents,
    planSavingsCents: planSavings.budgetCents,
    planSavingsRate: planSavings.percent,
    totalSpentCents: summary.totalSpentCents,
    accounts: budgets.map((account) => {
      const usedCents = summary.usedByAccount[account.key] || 0;
      const remainingCents = account.budgetCents - usedCents;
      const progress = account.budgetCents > 0
        ? Math.min(100, Math.round((usedCents / account.budgetCents) * 100))
        : 0;
      const isOverBudget = remainingCents < 0;

      return {
        key: account.key,
        name: account.name,
        budgetCents: account.budgetCents,
        usedCents,
        remainingCents,
        progress,
        isOverBudget
      };
    })
  };
}
