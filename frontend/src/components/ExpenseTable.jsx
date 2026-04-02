import React from 'react';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const formatDisplayDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

const ExpenseTable = ({ expenses, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expense-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Expense Table</p>
          <h2>All tracked ad spend</h2>
        </div>
        <span className="table-count">{expenses.length} entries</span>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state expense-empty-state">
          <p>No expenses match the current filters.</p>
        </div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Platform</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{formatDisplayDate(expense.date)}</td>
                  <td>
                    <span className={`platform-pill platform-${expense.platform.toLowerCase()}`}>
                      {expense.platform}
                    </span>
                  </td>
                  <td>{currency.format(expense.amount)}</td>
                  <td>{expense.notes || 'No notes added'}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="table-action table-edit"
                        onClick={() => onEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="table-action table-delete"
                        onClick={() => onDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
