import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ExpenseForm from '../components/ExpenseForm';
import SummaryCards from '../components/SummaryCards';
import ExpenseTable from '../components/ExpenseTable';
import { adsExpenseAPI, leadAPI } from '../utils/api';
import '../styles/AdsExpenses.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const defaultSummary = {
  total: 0,
  instagram: 0,
  facebook: 0,
  linkedin: 0,
  other: 0
};

const defaultLeadsByPlatform = {
  total: 0,
  instagram: 0,
  facebook: 0,
  linkedin: 0,
  other: 0
};

const otherLeadSources = ['direct', 'website', 'whatsapp', 'email', 'phone'];

const emptyFilters = {
  platform: '',
  startDate: '',
  endDate: ''
};

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const AdsExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(defaultSummary);
  const [leadsByPlatform, setLeadsByPlatform] = useState(defaultLeadsByPlatform);
  const [filters, setFilters] = useState(emptyFilters);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const currentMonthTotal = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const dailySpendMap = expenses.reduce((accumulator, expense) => {
    const label = new Date(expense.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
    accumulator[label] = (accumulator[label] || 0) + Number(expense.amount);
    return accumulator;
  }, {});

  const dailyLabels = Object.keys(dailySpendMap).reverse();
  const dailyValues = dailyLabels.map((label) => dailySpendMap[label]);

  const pieData = {
    labels: ['Instagram', 'Facebook', 'LinkedIn', 'Other'],
    datasets: [
      {
        data: [
          summary.instagram,
          summary.facebook,
          summary.linkedin,
          summary.other
        ],
        backgroundColor: ['#f65e97', '#3b82f6', '#0a66c2', '#f59e0b'],
        borderColor: '#ffffff',
        borderWidth: 3
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    layout: {
      padding: 8
    },
    radius: '78%'
  };

  const barData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Daily Spend',
        data: dailyValues,
        backgroundColor: '#4f46e5',
        borderRadius: 8
      }
    ]
  };

  const getQueryParams = () => {
    const params = {};

    if (filters.platform) {
      params.platform = filters.platform;
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    return params;
  };

  const mapLeadsToPlatforms = (stats = {}, selectedPlatform = '') => {
    const instagram = Number(stats.instagram || 0);
    const facebook = Number(stats.facebook || 0);
    const linkedin = Number(stats.linkedin || 0);
    const total = Number(stats.total || 0);
    const other = otherLeadSources.reduce(
      (count, source) => count + Number(stats[source] || 0),
      0
    );
    const fullBreakdown = {
      total,
      instagram,
      facebook,
      linkedin,
      other
    };

    if (!selectedPlatform) {
      return fullBreakdown;
    }

    switch (selectedPlatform) {
      case 'Instagram':
        return { ...defaultLeadsByPlatform, total: instagram, instagram };
      case 'Facebook':
        return { ...defaultLeadsByPlatform, total: facebook, facebook };
      case 'LinkedIn':
        return { ...defaultLeadsByPlatform, total: linkedin, linkedin };
      case 'Other':
        return { ...defaultLeadsByPlatform, total: other, other };
      default:
        return fullBreakdown;
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');

      const params = getQueryParams();
      const leadStatsParams = {
        startDate: params.startDate,
        endDate: params.endDate
      };

      const [expensesResponse, summaryResponse, leadStatsResponse] = await Promise.all([
        adsExpenseAPI.getAllExpenses(params),
        adsExpenseAPI.getSummary(params),
        leadAPI.getStats(leadStatsParams)
      ]);

      setExpenses(expensesResponse.data.data || []);
      setSummary(summaryResponse.data.data || defaultSummary);
      setLeadsByPlatform(mapLeadsToPlatforms(leadStatsResponse.data.data?.bySource
        ? {
            ...leadStatsResponse.data.data.bySource,
            total: leadStatsResponse.data.data.total
          }
        : defaultLeadsByPlatform, params.platform));
    } catch (fetchError) {
      console.error(fetchError);
      setError('Unable to load ads expenses right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters.platform, filters.startDate, filters.endDate]);

  const handleSaveExpense = async (expenseData) => {
    try {
      setFormLoading(true);

      if (editingExpense) {
        await adsExpenseAPI.updateExpense(editingExpense._id, expenseData);
      } else {
        await adsExpenseAPI.createExpense(expenseData);
      }

      setEditingExpense(null);
      await fetchExpenses();
      return true;
    } catch (saveError) {
      console.error(saveError);
      const apiMessage = saveError.response?.data?.message;
      alert(apiMessage || 'Unable to save expense.');
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense entry?')) {
      return;
    }

    try {
      await adsExpenseAPI.deleteExpense(id);
      if (editingExpense?._id === id) {
        setEditingExpense(null);
      }
      await fetchExpenses();
    } catch (deleteError) {
      console.error(deleteError);
      alert('Unable to delete expense.');
    }
  };

  const handleExportCsv = () => {
    if (!expenses.length) {
      alert('There are no expenses to export.');
      return;
    }

    const csvRows = [
      ['Date', 'Platform', 'Amount', 'Notes'],
      ...expenses.map((expense) => [
        new Date(expense.date).toISOString().split('T')[0],
        expense.platform,
        expense.amount,
        `"${(expense.notes || '').replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = 'ads-expenses-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ads-expenses-page">
      <header className="ads-expenses-header">
        <div>
          <p className="ads-expenses-eyebrow">Marketing Finance</p>
          <h1>Ads Expense Tracker</h1>
          <p className="ads-expenses-subtitle">
            Track campaign investment, compare platform-wise spend, and manage expenses from one place.
          </p>
        </div>

        <div className="ads-expenses-header-actions">
          <div className="top-investment-card">
            <span>Total Investment</span>
            <strong>{currency.format(summary.total)}</strong>
          </div>
          <Link to="/" className="nav-chip">
            <span className="nav-chip-icon">←</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="ads-expenses-layout">
        <section className="ads-expenses-grid">
          <ExpenseForm
            onSubmit={handleSaveExpense}
            loading={formLoading}
            initialValues={editingExpense}
            onCancel={() => setEditingExpense(null)}
          />

          <div className="expense-card">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Filter Options</p>
                <h2>Refine by platform or date range</h2>
              </div>
              <button
                type="button"
                className="secondary-action"
                onClick={() => setFilters(emptyFilters)}
              >
                Reset Filters
              </button>
            </div>

            <div className="filters-grid expense-filters-grid">
              <label className="expense-field">
                <span>Platform</span>
                <select
                  value={filters.platform}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, platform: event.target.value }))
                  }
                >
                  <option value="">All Platforms</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="expense-field">
                <span>Start Date</span>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
              </label>

              <label className="expense-field">
                <span>End Date</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
              </label>

              <div className="expense-form-actions filter-actions-inline">
                <button
                  type="button"
                  className="secondary-action"
                  onClick={fetchExpenses}
                >
                  Refresh Data
                </button>
                <button
                  type="button"
                  className="primary-action"
                  onClick={handleExportCsv}
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </section>

        <SummaryCards
          summary={summary}
          monthlyTotal={currentMonthTotal}
          leadsByPlatform={leadsByPlatform}
        />

        {error && <div className="error expense-page-error">{error}</div>}

        <section className="charts-grid">
          <div className="expense-card chart-card">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Pie Chart</p>
                <h2>Spend by platform</h2>
              </div>
            </div>
            <div className="chart-shell pie-chart-shell">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div className="expense-card chart-card">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Bar Chart</p>
                <h2>Daily spend trend</h2>
              </div>
            </div>
            <div className="chart-shell">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </section>

        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onEdit={setEditingExpense}
          onDelete={handleDeleteExpense}
        />
      </main>
    </div>
  );
};

export default AdsExpenses;
