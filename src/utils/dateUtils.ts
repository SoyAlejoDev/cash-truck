/**
 * Gets the week range (Sunday to Saturday) for a given date
 */
export const getWeekRange = (date: Date = new Date()): { startDate: Date; endDate: Date } => {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  
  // Clone the date to avoid modifying the original
  const startDate = new Date(date);
  // Set to Sunday of the current week
  startDate.setDate(date.getDate() - day);
  startDate.setHours(0, 0, 0, 0);
  
  // Clone the start date and add 6 days to get to Saturday
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format date to display format (e.g., Jan 1, 2025)
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Get formatted week label (e.g., "Jan 1 - Jan 7, 2025")
 */
export const getWeekLabel = (startDate: string, endDate: string): string => {
  return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
};

/**
 * Get current month name and year
 */
export const getCurrentMonthYear = (): string => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Get current year
 */
export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

/**
 * Gets week number of the year
 */
export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};