export const getMonthAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};
export const getDayAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};
export const getYearAgo = () => {
  const date = new Date();
  date.setDate(date.getFullYear() - 1);
  return date;
};
