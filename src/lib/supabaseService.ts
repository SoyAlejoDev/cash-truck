import { supabase } from '../lib/supabase';
import { AppState, WeekData, Expense, Income, ExpenseInput, IncomeInput } from '../types';
import { formatDateToString, getWeekRange } from '../utils/dateUtils';

/**
 * Supabase service for managing weeks, expenses, and incomes
 */
export class SupabaseService {
  /**
   * Get all data for the current user
   */
  static async loadUserData(): Promise<AppState> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Get weeks
    const { data: weeks, error: weeksError } = await supabase
      .from('weeks')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    if (weeksError) throw weeksError;

    // Get expenses for all weeks
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (expensesError) throw expensesError;

    // Get incomes for all weeks
    const { data: incomes, error: incomesError } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (incomesError) throw incomesError;

    // Group expenses and incomes by week
    const weeksWithData: WeekData[] = weeks?.map(week => ({
      id: week.id,
      startDate: week.start_date,
      endDate: week.end_date,
      expenses: expenses?.filter(exp => exp.week_id === week.id) || [],
      incomes: incomes?.filter(inc => inc.week_id === week.id) || []
    })) || [];

    // Find current week or create default
    const now = new Date();
    const { startDate, endDate } = getWeekRange(now);
    const currentWeek = weeksWithData.find(week =>
      week.startDate === formatDateToString(startDate) &&
      week.endDate === formatDateToString(endDate)
    );

    return {
      weeks: weeksWithData,
      currentWeekId: currentWeek?.id || null
    };
  }

  /**
   * Create or get week for a specific date
   */
  static async getOrCreateWeek(date: Date): Promise<WeekData> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { startDate, endDate } = getWeekRange(date);
    const startDateStr = formatDateToString(startDate);
    const endDateStr = formatDateToString(endDate);

    // Check if week exists
    const { data: existingWeek, error: fetchError } = await supabase
      .from('weeks')
      .select('*')
      .eq('user_id', user.id)
      .eq('start_date', startDateStr)
      .eq('end_date', endDateStr)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw fetchError;
    }

    if (existingWeek) {
      // Get expenses and incomes for this week
      const [expensesResult, incomesResult] = await Promise.all([
        supabase.from('expenses').select('*').eq('week_id', existingWeek.id),
        supabase.from('incomes').select('*').eq('week_id', existingWeek.id)
      ]);

      return {
        id: existingWeek.id,
        startDate: existingWeek.start_date,
        endDate: existingWeek.end_date,
        expenses: expensesResult.data || [],
        incomes: incomesResult.data || []
      };
    }

    // Create new week
    const { data: newWeek, error: insertError } = await supabase
      .from('weeks')
      .insert({
        start_date: startDateStr,
        end_date: endDateStr,
        user_id: user.id
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      id: newWeek.id,
      startDate: newWeek.start_date,
      endDate: newWeek.end_date,
      expenses: [],
      incomes: []
    };
  }

  /**
   * Add an expense
   */
  static async addExpense(weekId: string, expense: ExpenseInput): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        week_id: weekId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Add an income
   */
  static async addIncome(weekId: string, income: IncomeInput): Promise<Income> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('incomes')
      .insert({
        ...income,
        week_id: weekId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an expense
   */
  static async updateExpense(expense: Expense): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', expense.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an income
   */
  static async updateIncome(income: Income): Promise<Income> {
    const { data, error } = await supabase
      .from('incomes')
      .update(income)
      .eq('id', income.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Delete an income
   */
  static async deleteIncome(id: string): Promise<void> {
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}