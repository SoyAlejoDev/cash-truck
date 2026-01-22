import React from 'react';
import Card from '../common/Card';
import { useAppContext } from '../../context/AppContext';
import { calculateWeeklySummary } from '../../utils/calculationUtils';
import { formatCurrency } from '../../utils/calculationUtils';
import { Wallet, TrendingUp, ArrowDown, Scale } from 'lucide-react';

const FinancialSummary: React.FC = () => {
  const { currentWeek } = useAppContext();
  
  if (!currentWeek) {
    return null;
  }
  
  const summary = calculateWeeklySummary(currentWeek);
  
  // Define the summary cards
  const summaryCards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: <Wallet size={24} className="text-green-500" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: <ArrowDown size={24} className="text-red-500" />,
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700'
    },
    {
      title: 'Net Earnings',
      value: formatCurrency(summary.netEarnings),
      icon: <Scale size={24} className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      title: 'Profit Margin',
      value: summary.totalIncome > 0 
        ? `${Math.round((summary.netEarnings / summary.totalIncome) * 100)}%` 
        : '0%',
      icon: <TrendingUp size={24} className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className={`${card.color} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            <div>
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FinancialSummary;