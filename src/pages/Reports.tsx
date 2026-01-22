import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MonthlyReport from '../components/reports/MonthlyReport';
import YearlyReport from '../components/reports/YearlyReport';
import Button from '../components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Reports: React.FC = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
  
  // Functions to navigate between months
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Functions to navigate between years
  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1);
  };
  
  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };
  
  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <p className="text-gray-600">Track your financial performance over time</p>
      </div>
      
      {/* View Type Selector */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={viewType === 'monthly' ? 'primary' : 'outline'}
          onClick={() => setViewType('monthly')}
        >
          Monthly View
        </Button>
        <Button
          variant={viewType === 'yearly' ? 'primary' : 'outline'}
          onClick={() => setViewType('yearly')}
        >
          Yearly View
        </Button>
      </div>
      
      {/* Period Navigation */}
      {viewType === 'monthly' ? (
        <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {monthNames[selectedMonth]} {selectedYear}
            </h2>
            <button
              onClick={() => {
                setSelectedMonth(currentDate.getMonth());
                setSelectedYear(currentDate.getFullYear());
              }}
              className="text-sm text-blue-900 hover:underline"
            >
              Current Month
            </button>
          </div>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 mb-6">
          <button
            onClick={handlePrevYear}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">{selectedYear}</h2>
            <button
              onClick={() => setSelectedYear(currentDate.getFullYear())}
              className="text-sm text-blue-900 hover:underline"
            >
              Current Year
            </button>
          </div>
          
          <button
            onClick={handleNextYear}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next year"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      {/* Reports Content */}
      {viewType === 'monthly' ? (
        <MonthlyReport year={selectedYear} month={selectedMonth} />
      ) : (
        <YearlyReport year={selectedYear} />
      )}
    </Layout>
  );
};

export default Reports;