import React from 'react';
import { getWeekLabel } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface WeekSelectorProps {
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  disabled?: boolean;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
  disabled = false
}) => {
  const { currentWeek } = useAppContext();
  
  if (!currentWeek) {
    return null;
  }
  
  const weekLabel = getWeekLabel(currentWeek.startDate, currentWeek.endDate);
  
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 mb-6">
      <button
        onClick={onPrevWeek}
        disabled={disabled}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous week"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-800">{weekLabel}</h2>
        <button
          onClick={onCurrentWeek}
          disabled={disabled}
          className="text-sm text-blue-900 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Today
        </button>
      </div>

      <button
        onClick={onNextWeek}
        disabled={disabled}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next week"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default WeekSelector;