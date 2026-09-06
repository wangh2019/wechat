export function yuanToCents(value) {
  const text = String(value || "").replace(/,/g, "").trim();
  if (!text) {
    return 0;
  }

  const negative = text[0] === "-";
  const normalized = negative ? text.slice(1) : text;
  const parts = normalized.split(".");
  const yuanPart = (parts[0] || "0").replace(/[^\d]/g, "") || "0";
  const centPart = ((parts[1] || "").replace(/[^\d]/g, "") + "00").slice(0, 2);
  const cents = parseInt(yuanPart, 10) * 100 + parseInt(centPart, 10);

  return negative ? -cents : cents;
}

export function centsToYuan(cents) {
  const amount = Math.abs(Number(cents) || 0);
  const yuan = Math.floor(amount / 100);
  const fen = amount % 100;
  const sign = cents < 0 ? "-" : "";
  return `${sign}${yuan}.${String(fen).padStart(2, "0")}`;
}

export function formatCurrency(cents) {
  const yuanText = centsToYuan(cents);
  const negative = yuanText[0] === "-";
  const normalized = negative ? yuanText.slice(1) : yuanText;
  const parts = normalized.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = parts[1] || "00";
  const amount = decimalPart === "00" ? integerPart : `${integerPart}.${decimalPart}`;
  return `${negative ? "-" : ""}¥${amount}`;
}
