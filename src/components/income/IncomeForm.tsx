import React, { useState } from "react";
import { Income, IncomeInput } from "../../types";
import Button from "../common/Button";
import { useAppContext } from "../../context/AppContext";

interface IncomeFormProps {
  onSubmit: () => void;
  initialData?: Income;
  isEditing?: boolean;
}

const IncomeForm: React.FC<IncomeFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const { addIncome, updateIncome, currentWeek } = useAppContext();

  const [formData, setFormData] = useState<{
    date: string;
    amount: number;
    description: string;
  }>({
    date:
      initialData?.date ||
      currentWeek?.startDate ||
      new Date().toISOString().split("T")[0],
    amount: initialData?.amount || 0,
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // Parse float and handle non-numeric input
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const incomeData: IncomeInput = {
        date: formData.date,
        amount: formData.amount,
        description:
          formData.description && formData.description.trim()
            ? formData.description
            : null,
      };

      if (isEditing && initialData) {
        await updateIncome({
          ...incomeData,
          id: initialData.id,
          week_id: initialData.week_id,
          user_id: initialData.user_id,
        });
      } else {
        await addIncome(incomeData);
      }

      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        description: "",
      });
      setErrors({});
      onSubmit();
    } catch (error) {
      console.error("Error saving income:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save income. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={currentWeek?.startDate}
          max={currentWeek?.endDate}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount === 0 ? "" : formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Enter income details (optional)"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button variant="outline" onClick={onSubmit} type="button">
          Cancel
        </Button>
        <Button type="submit" variant="success" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Income" : "Add Income"}
        </Button>
      </div>
    </form>
  );
};

export default IncomeForm;
