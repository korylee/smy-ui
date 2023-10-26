export const getMonthEndDay = (year: number, month: number) => 32 - new Date(year, month - 1, 32).getDate()
