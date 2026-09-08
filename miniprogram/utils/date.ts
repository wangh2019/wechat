export function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function monthKey(dateText) {
  return String(dateText || "").slice(0, 7);
}

export function currentMonthKey() {
  return monthKey(todayString());
}

export function isInCurrentMonth(dateText) {
  return monthKey(dateText) === currentMonthKey();
}
