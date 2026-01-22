import React, { useState } from 'react';
import { Income } from '../../types';
import { formatCurrency } from '../../utils/calculationUtils';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../layout/Modal';
import IncomeForm from './IncomeForm';

interface IncomeListProps {
  incomes: Income[];
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes }) => {
  const { deleteIncome } = useAppContext();
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sort incomes by date (newest first)
  const sortedIncomes = [...incomes].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income?')) {
      deleteIncome(id);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };
  
  if (incomes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No income recorded for this week.</p>
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
            {sortedIncomes.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateForDisplay(income.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {income.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-700">
                  {formatCurrency(income.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(income)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
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
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Income">
        {editingIncome && (
          <IncomeForm
            initialData={editingIncome}
            onSubmit={closeModal}
            isEditing={true}
          />
        )}
      </Modal>
    </>
  );
};

export default IncomeList;