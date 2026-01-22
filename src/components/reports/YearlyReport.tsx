import React, { useMemo } from 'react';
import Card from '../common/Card';
import { useAppContext } from '../../context/AppContext';
import { calculateYearlySummary } from '../../utils/calculationUtils';
import { formatCurrency } from '../../utils/calculationUtils';

interface YearlyReportProps {
  year: number;
}

const YearlyReport: React.FC<YearlyReportProps> = ({ year }) => {
  const { state } = useAppContext();
  
  const summary = useMemo(() => {
    return calculateYearlySummary(state.weeks, year);
  }, [state.weeks, year]);
  
  if (summary.numberOfWeeks === 0) {
    return (
      <Card className="mb-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for {year}.</p>
        </div>
      </Card>
    );
  }
  
  // Month names for displaying the monthly breakdown
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return (
    <Card title={`Annual Summary - ${year}`} className="mb-6">
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
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Monthly Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.monthlyBreakdown.map((month, index) => {
                  if (month.numberOfWeeks === 0) return null;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {monthNames[index]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-green-700">
                        {formatCurrency(month.totalIncome)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-red-700">
                        {formatCurrency(month.totalExpenses)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {formatCurrency(month.netEarnings)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Based on data from {summary.numberOfWeeks} {summary.numberOfWeeks === 1 ? 'week' : 'weeks'}.
        </div>
      </div>
    </Card>
  );
};

export default YearlyReport;