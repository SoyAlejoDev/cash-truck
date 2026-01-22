export type ExpenseCategory = 'fuel' | 'maintenance' | 'other';

export interface Expense {
  id: string;
  week_id: string;
  user_id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  created_at?: string;
}

export interface ExpenseInput {
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
}

export interface Income {
  id: string;
  week_id: string;
  user_id: string;
  date: string;
  amount: number;
  description: string | null;
  created_at?: string;
}

export interface IncomeInput {
  date: string;
  amount: number;
  description: string | null;
}

export interface WeekData {
  id: string;
  startDate: string; // Sunday
  endDate: string;   // Saturday
  expenses: Expense[];
  incomes: Income[];
}

export interface AppState {
  weeks: WeekData[];
  currentWeekId: string | null;
}