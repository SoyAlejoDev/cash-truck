import { AppState, WeekData, Expense, Income } from '../types';
import { formatDateToString, getWeekRange } from './dateUtils';

const STORAGE_KEY = 'truckerExpenseTracker';

/**
 * Load app state from local storage
 */
export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return initializeState();
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return initializeState();
  }
};

/**
 * Save app state to local storage
 */
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

/**
 * Initialize app state with current week
 */
const initializeState = (): AppState => {
  const { startDate, endDate } = getWeekRange();
  const weekId = `week-${Date.now()}`;
  
  const currentWeek: WeekData = {
    id: weekId,
    startDate: formatDateToString(startDate),
    endDate: formatDateToString(endDate),
    expenses: [],
    incomes: []
  };
  
  return {
    weeks: [currentWeek],
    currentWeekId: weekId
  };
};

/**
 * Get or create week data for a specific date
 */
export const getOrCreateWeekData = (state: AppState, date: Date): { updatedState: AppState, weekId: string } => {
  const { startDate, endDate } = getWeekRange(date);
  const startDateStr = formatDateToString(startDate);
  const endDateStr = formatDateToString(endDate);
  
  // Check if week already exists
  const existingWeek = state.weeks.find(
    week => week.startDate === startDateStr && week.endDate === endDateStr
  );
  
  if (existingWeek) {
    return { 
      updatedState: { ...state, currentWeekId: existingWeek.id },
      weekId: existingWeek.id
    };
  }
  
  // Create new week
  const weekId = `week-${Date.now()}`;
  const newWeek: WeekData = {
    id: weekId,
    startDate: startDateStr,
    endDate: endDateStr,
    expenses: [],
    incomes: []
  };
  
  const updatedState = {
    ...state,
    weeks: [...state.weeks, newWeek],
    currentWeekId: weekId
  };
  
  return { updatedState, weekId };
};

/**
 * Generate a unique ID for expenses and incomes
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};