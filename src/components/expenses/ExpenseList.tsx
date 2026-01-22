import React, { useState } from 'react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/calculationUtils';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../layout/Modal';
import ExpenseForm from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const { deleteExpense } = useAppContext();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  // Get category badge style
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'fuel':
        return 'bg-amber-100 text-amber-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No expenses recorded for this week.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateForDisplay(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(expense.category)}`}>
                    {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Expense">
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={closeModal}
            isEditing={true}
          />
        )}
      </Modal>
    </>
  );
};

export default ExpenseList;