export const getToday = () => new Date().toISOString().split("T")[0];
// 取得本月份（格式：2024-06）
export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

// 取得本年度（格式：2024）
export const getCurrentYear = () => String(new Date().getFullYear());

export const lastDayOfMonth = () => {
  const today = getToday();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
};