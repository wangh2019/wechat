import { deleteTransaction, getSettings, listCurrentMonthTransactions } from "../../services/storage";
import { getAccountName } from "../../constants/budget";
import { formatCurrency } from "../../utils/money";

function formatRecords(records) {
  return records.map((record) => ({
    id: record.id,
    date: record.date,
    category: getAccountName(record.accountKey),
    note: record.note || "无备注",
    amountText: formatCurrency(record.amountCents)
  }));
}

Page({
  data: {
    records: []
  },

  onShow() {
    if (!getSettings()) {
      wx.reLaunch({ url: "/pages/onboarding/onboarding" });
      return;
    }

    this.refresh();
  },

  refresh() {
    this.setData({
      records: formatRecords(listCurrentMonthTransactions())
    });
  },

  deleteRecord(event) {
    const id = event.currentTarget.dataset.id;
    wx.showModal({
      title: "删除记录",
      content: "删除后本月金额会立即恢复，是否继续？",
      confirmColor: "#B91C1C",
      success: (result) => {
        if (result.confirm) {
          deleteTransaction(id);
          this.refresh();
        }
      }
    });
  },

  goTransaction() {
    wx.navigateTo({ url: "/pages/transaction/transaction" });
  }
});
