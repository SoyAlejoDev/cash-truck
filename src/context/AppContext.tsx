import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  AppState,
  Expense,
  Income,
  ExpenseInput,
  IncomeInput,
  WeekData,
} from "../types";
import { SupabaseService } from "../lib/supabaseService";
import { useAuth } from "./AuthContext";

// Define action types
type Action =
  | { type: "INITIALIZE"; payload: AppState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURRENT_WEEK"; payload: string }
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "ADD_INCOME"; payload: Income }
  | { type: "UPDATE_EXPENSE"; payload: Expense }
  | { type: "UPDATE_INCOME"; payload: Income }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "DELETE_INCOME"; payload: string }
  | { type: "SELECT_WEEK"; payload: WeekData };

// Define context type
interface AppContextType {
  state: AppState & { loading: boolean };
  currentWeek: WeekData | undefined;
  dispatch: React.Dispatch<Action>;
  addExpense: (expense: ExpenseInput) => Promise<void>;
  addIncome: (income: IncomeInput) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  selectWeek: (date: Date) => Promise<void>;
}

// Initial state
const initialState: AppState & { loading: boolean } = {
  weeks: [],
  currentWeekId: null,
  loading: true,
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function
const appReducer = (
  state: AppState & { loading: boolean },
  action: Action,
): AppState & { loading: boolean } => {
  switch (action.type) {
    case "INITIALIZE":
      return { ...action.payload, loading: false };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_CURRENT_WEEK":
      return {
        ...state,
        currentWeekId: action.payload,
      };

    case "ADD_EXPENSE": {
      const { currentWeekId, weeks } = state;
      if (!currentWeekId) return state;

      return {
        ...state,
        weeks: weeks.map((week) =>
          week.id === currentWeekId
            ? { ...week, expenses: [...week.expenses, action.payload] }
            : week,
        ),
      };
    }

    case "ADD_INCOME": {
      const { currentWeekId, weeks } = state;
      if (!currentWeekId) return state;

      return {
        ...state,
        weeks: weeks.map((week) =>
          week.id === currentWeekId
            ? { ...week, incomes: [...week.incomes, action.payload] }
            : week,
        ),
      };
    }

    case "UPDATE_EXPENSE": {
      const { weeks } = state;

      return {
        ...state,
        weeks: weeks.map((week) => ({
          ...week,
          expenses: week.expenses.map((expense) =>
            expense.id === action.payload.id ? action.payload : expense,
          ),
        })),
      };
    }

    case "UPDATE_INCOME": {
      const { weeks } = state;

      return {
        ...state,
        weeks: weeks.map((week) => ({
          ...week,
          incomes: week.incomes.map((income) =>
            income.id === action.payload.id ? action.payload : income,
          ),
        })),
      };
    }

    case "DELETE_EXPENSE": {
      const { weeks } = state;

      return {
        ...state,
        weeks: weeks.map((week) => ({
          ...week,
          expenses: week.expenses.filter(
            (expense) => expense.id !== action.payload,
          ),
        })),
      };
    }

    case "DELETE_INCOME": {
      const { weeks } = state;

      return {
        ...state,
        weeks: weeks.map((week) => ({
          ...week,
          incomes: week.incomes.filter(
            (income) => income.id !== action.payload,
          ),
        })),
      };
    }

    case "SELECT_WEEK": {
      const { weeks } = state;
      const weekExists = weeks.some((w) => w.id === action.payload.id);

      return {
        ...state,
        weeks: weekExists
          ? weeks.map((w) => (w.id === action.payload.id ? action.payload : w))
          : [...weeks, action.payload],
        currentWeekId: action.payload.id,
      };
    }

    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  const currentWeek = state.currentWeekId
    ? state.weeks.find((week) => week.id === state.currentWeekId)
    : undefined;

  // Initialize state from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const userData = await SupabaseService.loadUserData();
          dispatch({ type: "INITIALIZE", payload: userData });

          // Always ensure current week exists and is selected
          const currentWeekData = await SupabaseService.getOrCreateWeek(
            new Date(),
          );
          dispatch({ type: "SELECT_WEEK", payload: currentWeekData });
        } catch (error) {
          console.error("Error loading data:", error);
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      loadData();
    } else {
      dispatch({
        type: "INITIALIZE",
        payload: { weeks: [], currentWeekId: null },
      });
    }
  }, [user]);

  // Helper functions
  const addExpense = async (expense: ExpenseInput) => {
    const { currentWeekId, weeks } = state;
    if (!currentWeekId) {
      const weekData = await SupabaseService.getOrCreateWeek(new Date());
      dispatch({ type: "SELECT_WEEK", payload: weekData });
      const newExpense = await SupabaseService.addExpense(weekData.id, expense);
      dispatch({ type: "ADD_EXPENSE", payload: newExpense });
    } else {
      const newExpense = await SupabaseService.addExpense(
        currentWeekId,
        expense,
      );
      dispatch({ type: "ADD_EXPENSE", payload: newExpense });
    }
  };

  const addIncome = async (income: IncomeInput) => {
    const { currentWeekId, weeks } = state;
    if (!currentWeekId) {
      const weekData = await SupabaseService.getOrCreateWeek(new Date());
      dispatch({ type: "SELECT_WEEK", payload: weekData });
      const newIncome = await SupabaseService.addIncome(weekData.id, income);
      dispatch({ type: "ADD_INCOME", payload: newIncome });
    } else {
      const newIncome = await SupabaseService.addIncome(currentWeekId, income);
      dispatch({ type: "ADD_INCOME", payload: newIncome });
    }
  };

  const updateExpense = async (expense: Expense) => {
    try {
      const updatedExpense = await SupabaseService.updateExpense(expense);
      dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpense });
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  const updateIncome = async (income: Income) => {
    try {
      const updatedIncome = await SupabaseService.updateIncome(income);
      dispatch({ type: "UPDATE_INCOME", payload: updatedIncome });
    } catch (error) {
      console.error("Error updating income:", error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await SupabaseService.deleteExpense(id);
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await SupabaseService.deleteIncome(id);
      dispatch({ type: "DELETE_INCOME", payload: id });
    } catch (error) {
      console.error("Error deleting income:", error);
      throw error;
    }
  };

  const selectWeek = async (date: Date) => {
    try {
      const week = await SupabaseService.getOrCreateWeek(date);
      dispatch({ type: "SELECT_WEEK", payload: week });
    } catch (error) {
      console.error("Error selecting week:", error);
      throw error;
    }
  };

  const contextValue: AppContextType = {
    state,
    currentWeek,
    dispatch,
    addExpense,
    addIncome,
    updateExpense,
    updateIncome,
    deleteExpense,
    deleteIncome,
    selectWeek,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
