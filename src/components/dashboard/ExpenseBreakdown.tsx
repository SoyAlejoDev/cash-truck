import React from 'react';
import Card from '../common/Card';
import { useAppContext } from '../../context/AppContext';
import { calculateExpensesByCategory, formatCurrency } from '../../utils/calculationUtils';
import { Fuel, PenTool as Tool, MoreHorizontal } from 'lucide-react';

const ExpenseBreakdown: React.FC = () => {
  const { currentWeek } = useAppContext();
  
  if (!currentWeek || currentWeek.expenses.length === 0) {
    return null;
  }
  
  const expensesByCategory = calculateExpensesByCategory(currentWeek.expenses);
  
  // Category icons and colors
  const categoryConfig = {
    fuel: {
      icon: <Fuel size={20} className="text-amber-600" />,
      color: 'bg-amber-100',
      textColor: 'text-amber-800'
    },
    maintenance: {
      icon: <Tool size={20} className="text-blue-600" />,
      color: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    other: {
      icon: <MoreHorizontal size={20} className="text-gray-600" />,
      color: 'bg-gray-100',
      textColor: 'text-gray-800'
    }
  };
  
  // Calculate total expenses for percentage
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  return (
    <Card title="Expense Breakdown" className="mb-6">
      <div className="space-y-4">
        {Object.entries(expensesByCategory).map(([category, amount]) => {
          const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
          const config = categoryConfig[category as keyof typeof categoryConfig];
          
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${config.color}`}>
                  {config.icon}
                </div>
                <div>
                  <p className="font-medium capitalize">{category}</p>
                  <p className="text-sm text-gray-500">{percentage}% of expenses</p>
                </div>
              </div>
              <p className={`font-semibold ${config.textColor}`}>{formatCurrency(amount)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ExpenseBreakdown;