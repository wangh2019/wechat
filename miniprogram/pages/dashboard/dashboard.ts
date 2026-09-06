import { getSettings, listCurrentMonthTransactions } from "../../services/storage";
import { buildDashboard } from "../../utils/summary";
import { formatCurrency } from "../../utils/money";

function formatAccounts(accounts) {
  return accounts.map((account) => ({
    key: account.key,
    name: account.name,
    budgetText: formatCurrency(account.budgetCents),
    usedText: formatCurrency(account.usedCents),
    remainingText: formatCurrency(account.remainingCents),
    progress: account.progress
  }));
}

Page({
  data: {
    hasSettings: false,
    monthlyIncomeText: "¥0",
    planSavingsText: "¥0",
    planSavingsRateText: "0%",
    totalSpentText: "¥0",
    accounts: []
  },

  onShow() {
    const settings = getSettings();

    if (!settings) {
      wx.reLaunch({ url: "/pages/onboarding/onboarding" });
      return;
    }

    const dashboard = buildDashboard(settings, listCurrentMonthTransactions());
    this.setData({
      hasSettings: true,
      monthlyIncomeText: formatCurrency(dashboard.monthlyIncomeCents),
      planSavingsText: formatCurrency(dashboard.planSavingsCents),
      planSavingsRateText: `${dashboard.planSavingsRate}%`,
      totalSpentText: formatCurrency(dashboard.totalSpentCents),
      accounts: formatAccounts(dashboard.accounts)
    });
  },

  goTransaction() {
    wx.navigateTo({ url: "/pages/transaction/transaction" });
  }
});
