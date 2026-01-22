import { Expense, Income, WeekData } from '../types';

/**
 * Calculate total expenses for a given list of expenses
 */
export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

/**
 * Calculate total income for a given list of incomes
 */
export const calculateTotalIncome = (incomes: Income[]): number => {
  return incomes.reduce((total, income) => total + income.amount, 0);
};

/**
 * Calculate net earnings (income - expenses)
 */
export const calculateNetEarnings = (incomes: Income[], expenses: Expense[]): number => {
  const totalIncome = calculateTotalIncome(incomes);
  const totalExpenses = calculateTotalExpenses(expenses);
  return totalIncome - totalExpenses;
};

/**
 * Calculate expenses by category
 */
export const calculateExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculate weekly summary
 */
export const calculateWeeklySummary = (week: WeekData) => {
  const totalIncome = calculateTotalIncome(week.incomes);
  const totalExpenses = calculateTotalExpenses(week.expenses);
  const netEarnings = totalIncome - totalExpenses;
  const expensesByCategory = calculateExpensesByCategory(week.expenses);
  
  return {
    totalIncome,
    totalExpenses,
    netEarnings,
    expensesByCategory
  };
};

/**
 * Calculate monthly summary from weeks
 */
export const calculateMonthlySummary = (weeks: WeekData[], year: number, month: number) => {
  // Filter weeks that have days in the specified month and year
  const weeksInMonth = weeks.filter(week => {
    const startDate = new Date(week.startDate);
    const endDate = new Date(week.endDate);
    
    // Check if week overlaps with the specified month
    return (
      (startDate.getFullYear() === year && startDate.getMonth() === month) ||
      (endDate.getFullYear() === year && endDate.getMonth() === month)
    );
  });
  
  const allExpenses = weeksInMonth.flatMap(week => week.expenses);
  const allIncomes = weeksInMonth.flatMap(week => week.incomes);
  
  return {
    totalIncome: calculateTotalIncome(allIncomes),
    totalExpenses: calculateTotalExpenses(allExpenses),
    netEarnings: calculateNetEarnings(allIncomes, allExpenses),
    expensesByCategory: calculateExpensesByCategory(allExpenses),
    numberOfWeeks: weeksInMonth.length
  };
};

/**
 * Calculate yearly summary from weeks
 */
export const calculateYearlySummary = (weeks: WeekData[], year: number) => {
  // Filter weeks that have days in the specified year
  const weeksInYear = weeks.filter(week => {
    const startDate = new Date(week.startDate);
    const endDate = new Date(week.endDate);
    
    return startDate.getFullYear() === year || endDate.getFullYear() === year;
  });
  
  const allExpenses = weeksInYear.flatMap(week => week.expenses);
  const allIncomes = weeksInYear.flatMap(week => week.incomes);
  
  // Calculate monthly breakdowns
  const monthlyBreakdown = Array(12).fill(0).map((_, monthIndex) => {
    return calculateMonthlySummary(weeks, year, monthIndex);
  });
  
  return {
    totalIncome: calculateTotalIncome(allIncomes),
    totalExpenses: calculateTotalExpenses(allExpenses),
    netEarnings: calculateNetEarnings(allIncomes, allExpenses),
    expensesByCategory: calculateExpensesByCategory(allExpenses),
    monthlyBreakdown,
    numberOfWeeks: weeksInYear.length
  };
};