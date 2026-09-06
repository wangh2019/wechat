import { BUDGET_MODES } from "../../constants/budget";
import { clearAllData, getSettings, saveSettings } from "../../services/storage";
import { centsToYuan, yuanToCents } from "../../utils/money";

function modeNames() {
  return BUDGET_MODES.map((mode) => mode.name);
}

function findModeIndex(modeKey) {
  const index = BUDGET_MODES.findIndex((mode) => mode.key === modeKey);
  return index >= 0 ? index : 0;
}

function getModeNameByIndex(index) {
  return BUDGET_MODES[index] ? BUDGET_MODES[index].name : BUDGET_MODES[0].name;
}

Page({
  data: {
    incomeInput: "",
    savingsInput: "",
    modeIndex: 0,
    selectedModeName: getModeNameByIndex(0),
    modeNames: modeNames()
  },

  onShow() {
    const settings = getSettings();
    if (!settings) {
      wx.reLaunch({ url: "/pages/onboarding/onboarding" });
      return;
    }

    const modeIndex = findModeIndex(settings.budgetMode);
    this.setData({
      incomeInput: centsToYuan(settings.monthlyIncomeCents),
      savingsInput: centsToYuan(settings.currentSavingsCents),
      modeIndex,
      selectedModeName: getModeNameByIndex(modeIndex)
    });
  },

  onIncomeInput(event) {
    this.setData({ incomeInput: event.detail.value });
  },

  onSavingsInput(event) {
    this.setData({ savingsInput: event.detail.value });
  },

  onModeChange(event) {
    const modeIndex = Number(event.detail.value) || 0;
    this.setData({
      modeIndex,
      selectedModeName: getModeNameByIndex(modeIndex)
    });
  },

  saveProfile() {
    const monthlyIncomeCents = yuanToCents(this.data.incomeInput);
    const currentSavingsCents = yuanToCents(this.data.savingsInput);

    if (monthlyIncomeCents <= 0) {
      wx.showToast({ title: "请填写月到手收入", icon: "none" });
      return;
    }

    saveSettings({
      monthlyIncomeCents,
      currentSavingsCents,
      budgetMode: BUDGET_MODES[this.data.modeIndex].key
    });

    wx.showToast({ title: "已保存", icon: "success" });
  },

  clearData() {
    wx.showModal({
      title: "清空所有本地数据",
      content: "将删除设置和全部记录，是否继续？",
      confirmColor: "#B91C1C",
      success: (result) => {
        if (result.confirm) {
          clearAllData();
          wx.reLaunch({ url: "/pages/onboarding/onboarding" });
        }
      }
    });
  }
});
