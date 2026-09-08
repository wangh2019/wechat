import { ACCOUNT_DEFINITIONS } from "../../constants/budget";
import { addTransaction } from "../../services/storage";
import { todayString } from "../../utils/date";
import { yuanToCents } from "../../utils/money";

function buildAccountNames() {
  return ACCOUNT_DEFINITIONS.map((account) => account.name);
}

function getAccountNameByIndex(index) {
  return ACCOUNT_DEFINITIONS[index] ? ACCOUNT_DEFINITIONS[index].name : ACCOUNT_DEFINITIONS[0].name;
}

Page({
  data: {
    amountInput: "",
    accountIndex: 0,
    selectedAccountName: getAccountNameByIndex(0),
    accountNames: buildAccountNames(),
    note: "",
    date: todayString()
  },

  onAmountInput(event) {
    this.setData({ amountInput: event.detail.value });
  },

  onAccountChange(event) {
    const accountIndex = Number(event.detail.value) || 0;
    this.setData({
      accountIndex,
      selectedAccountName: getAccountNameByIndex(accountIndex)
    });
  },

  onNoteInput(event) {
    this.setData({ note: event.detail.value });
  },

  onDateChange(event) {
    this.setData({ date: event.detail.value });
  },

  saveTransaction() {
    const amountCents = yuanToCents(this.data.amountInput);
    const account = ACCOUNT_DEFINITIONS[this.data.accountIndex];

    if (amountCents <= 0) {
      wx.showToast({ title: "请填写金额", icon: "none" });
      return;
    }

    addTransaction({
      amountCents,
      accountKey: account.key,
      note: this.data.note,
      date: this.data.date
    });

    wx.showToast({ title: "已保存", icon: "success" });

    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: "/pages/dashboard/dashboard" });
    }
  }
});
