import React, { useEffect, useState } from 'react';

const defaultFormState = {
  platform: 'Instagram',
  amount: '',
  date: '',
  notes: ''
};

const formatDateForInput = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().split('T')[0];
};

const ExpenseForm = ({ onSubmit, loading, initialValues, onCancel }) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setFormData({
        platform: initialValues.platform || 'Instagram',
        amount: initialValues.amount || '',
        date: formatDateForInput(initialValues.date),
        notes: initialValues.notes || ''
      });
      setError('');
      return;
    }

    setFormData(defaultFormState);
    setError('');
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormState);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.platform) {
      setError('Platform is required.');
      return;
    }

    if (!Number(formData.amount) || Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (!formData.date) {
      setError('Date is required.');
      return;
    }

    const success = await onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });

    if (success && !initialValues) {
      resetForm();
    }
  };

  const isEditing = Boolean(initialValues?._id);

  return (
    <div className="expense-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Add Expense Form</p>
          <h2>{isEditing ? 'Update ad spend entry' : 'Log a new campaign expense'}</h2>
        </div>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="expense-form-grid">
          <label className="expense-field">
            <span>Platform</span>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
            >
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="expense-field">
            <span>Amount</span>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </label>

          <label className="expense-field">
            <span>Date</span>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>

          <label className="expense-field expense-field-notes">
            <span>Notes</span>
            <textarea
              name="notes"
              rows="4"
              placeholder="Optional campaign note"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
        </div>

        {error && <p className="expense-feedback error-text">{error}</p>}

        <div className="expense-form-actions">
          <button type="submit" className="primary-action" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                resetForm();
                onCancel();
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
