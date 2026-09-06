import { ACCOUNT_DEFINITIONS, BUDGET_PRESETS } from "../constants/budget";

export function getPreset(mode) {
  return BUDGET_PRESETS[mode] || BUDGET_PRESETS.balanced;
}

export function presetTotalPercent(mode) {
  const preset = getPreset(mode);
  return ACCOUNT_DEFINITIONS.reduce((sum, account) => sum + preset[account.key], 0);
}

export function calculateAccountBudgets(monthlyIncomeCents, mode) {
  const preset = getPreset(mode);
  let allocatedCents = 0;

  return ACCOUNT_DEFINITIONS.map((account, index) => {
    const percent = preset[account.key];
    const isLast = index === ACCOUNT_DEFINITIONS.length - 1;
    const budgetCents = isLast
      ? Math.max(0, monthlyIncomeCents - allocatedCents)
      : Math.floor((monthlyIncomeCents * percent) / 100);

    allocatedCents += budgetCents;

    return {
      key: account.key,
      name: account.name,
      percent,
      budgetCents
    };
  });
}

export function getPlanSavingsBudget(monthlyIncomeCents, mode) {
  const budgets = calculateAccountBudgets(monthlyIncomeCents, mode);
  return budgets.find((item) => item.key === "future") || budgets[budgets.length - 1];
}
