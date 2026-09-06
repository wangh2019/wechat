import { BUDGET_MODES } from "../../constants/budget";
import { yuanToCents } from "../../utils/money";
import { getSettings, saveSettings } from "../../services/storage";

function buildModes(selectedMode) {
  return BUDGET_MODES.map((mode) => ({
    key: mode.key,
    name: mode.name,
    selectedClass: mode.key === selectedMode ? "active" : ""
  }));
}

Page({
  data: {
    incomeInput: "",
    savingsInput: "",
    budgetMode: "balanced",
    modes: buildModes("balanced")
  },

  onLoad() {
    if (getSettings()) {
      wx.switchTab({ url: "/pages/dashboard/dashboard" });
    }
  },

  onIncomeInput(event) {
    this.setData({ incomeInput: event.detail.value });
  },

  onSavingsInput(event) {
    this.setData({ savingsInput: event.detail.value });
  },

  selectMode(event) {
    const budgetMode = event.currentTarget.dataset.mode;
    this.setData({
      budgetMode,
      modes: buildModes(budgetMode)
    });
  },

  saveOnboarding() {
    const monthlyIncomeCents = yuanToCents(this.data.incomeInput);
    const currentSavingsCents = yuanToCents(this.data.savingsInput);

    if (monthlyIncomeCents <= 0) {
      wx.showToast({ title: "请填写月到手收入", icon: "none" });
      return;
    }

    saveSettings({
      monthlyIncomeCents,
      currentSavingsCents,
      budgetMode: this.data.budgetMode
    });

    wx.switchTab({ url: "/pages/dashboard/dashboard" });
  }
});
