import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import WeekSelector from '../components/common/WeekSelector';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown';
import ExpenseList from '../components/expenses/ExpenseList';
import IncomeList from '../components/income/IncomeList';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';
import Modal from '../components/layout/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import IncomeForm from '../components/income/IncomeForm';

const Dashboard: React.FC = () => {
  const { currentWeek, selectWeek, state } = useAppContext();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Functions to handle week navigation
  const handlePrevWeek = async () => {
    if (currentWeek && !navigating) {
      setNavigating(true);
      try {
        const prevWeekDate = new Date(currentWeek.startDate);
        prevWeekDate.setDate(prevWeekDate.getDate() - 7);
        await selectWeek(prevWeekDate);
      } catch (error) {
        console.error('Error navigating to previous week:', error);
      } finally {
        setNavigating(false);
      }
    }
  };

  const handleNextWeek = async () => {
    if (currentWeek && !navigating) {
      setNavigating(true);
      try {
        const nextWeekDate = new Date(currentWeek.startDate);
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);
        await selectWeek(nextWeekDate);
      } catch (error) {
        console.error('Error navigating to next week:', error);
      } finally {
        setNavigating(false);
      }
    }
  };

  const handleCurrentWeek = async () => {
    if (!navigating) {
      setNavigating(true);
      try {
        await selectWeek(new Date());
      } catch (error) {
        console.error('Error navigating to current week:', error);
      } finally {
        setNavigating(false);
      }
    }
  };
  
  if (state.loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Week Selector */}
      <WeekSelector
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onCurrentWeek={handleCurrentWeek}
        disabled={navigating}
      />
      
      {/* Financial Summary */}
      <FinancialSummary />
      
      {/* Expense Breakdown */}
      <ExpenseBreakdown />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses Section */}
        <Card 
          title="Expenses" 
          className="overflow-hidden"
          footer={
            <Button 
              variant="primary" 
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Expense</span>
            </Button>
          }
        >
          {currentWeek && <ExpenseList expenses={currentWeek.expenses} />}
        </Card>
        
        {/* Income Section */}
        <Card 
          title="Income" 
          className="overflow-hidden"
          footer={
            <Button 
              variant="success" 
              onClick={() => setIsIncomeModalOpen(true)}
              className="flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Income</span>
            </Button>
          }
        >
          {currentWeek && <IncomeList incomes={currentWeek.incomes} />}
        </Card>
      </div>
      
      {/* Add Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add Expense">
        <ExpenseForm onSubmit={() => setIsExpenseModalOpen(false)} />
      </Modal>
      
      {/* Add Income Modal */}
      <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="Add Income">
        <IncomeForm onSubmit={() => setIsIncomeModalOpen(false)} />
      </Modal>
    </Layout>
  );
};

export default Dashboard;