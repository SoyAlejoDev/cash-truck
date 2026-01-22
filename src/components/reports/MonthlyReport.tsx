import React, { useMemo } from 'react';
import Card from '../common/Card';
import { useAppContext } from '../../context/AppContext';
import { calculateMonthlySummary } from '../../utils/calculationUtils';
import { formatCurrency } from '../../utils/calculationUtils';

interface MonthlyReportProps {
  year: number;
  month: number;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ year, month }) => {
  const { state } = useAppContext();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const summary = useMemo(() => {
    return calculateMonthlySummary(state.weeks, year, month);
  }, [state.weeks, year, month]);
  
  if (summary.numberOfWeeks === 0) {
    return (
      <Card className="mb-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for {monthNames[month]} {year}.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title={`${monthNames[month]} ${year}`} className="mb-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(summary.totalIncome)}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-xl font-bold text-red-700">{formatCurrency(summary.totalExpenses)}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Net Earnings</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(summary.netEarnings)}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Expense Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(summary.expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="capitalize">{category}</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Based on data from {summary.numberOfWeeks} {summary.numberOfWeeks === 1 ? 'week' : 'weeks'}.
        </div>
      </div>
    </Card>
  );
};

export default MonthlyReport;