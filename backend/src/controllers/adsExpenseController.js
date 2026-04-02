const AdsExpense = require('../models/AdsExpense');

const buildExpenseFilter = (query = {}) => {
  const { platform, startDate, endDate } = query;
  const filter = {};

  if (platform) {
    filter.platform = platform;
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setHours(23, 59, 59, 999);
      filter.date.$lte = inclusiveEndDate;
    }
  }

  return filter;
};

const createSummaryPayload = (rows = []) => {
  const summary = {
    total: 0,
    instagram: 0,
    facebook: 0,
    linkedin: 0,
    other: 0
  };

  rows.forEach((row) => {
    const totalAmount = Number(row.totalAmount || 0);
    summary.total += totalAmount;

    switch (row._id) {
      case 'Instagram':
        summary.instagram = totalAmount;
        break;
      case 'Facebook':
        summary.facebook = totalAmount;
        break;
      case 'LinkedIn':
        summary.linkedin = totalAmount;
        break;
      default:
        summary.other += totalAmount;
        break;
    }
  });

  return Object.fromEntries(
    Object.entries(summary).map(([key, value]) => [key, Number(value.toFixed(2))])
  );
};

exports.createAdsExpense = async (req, res, next) => {
  try {
    const { platform, amount, date, notes } = req.body;

    const expense = await AdsExpense.create({
      platform,
      amount,
      date,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Ads expense added successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdsExpenses = async (req, res, next) => {
  try {
    const filter = buildExpenseFilter(req.query);
    const expenses = await AdsExpense.find(filter).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdsExpenseSummary = async (req, res, next) => {
  try {
    const filter = buildExpenseFilter(req.query);

    const summaryRows = await AdsExpense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$platform',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: createSummaryPayload(summaryRows)
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAdsExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { platform, amount, date, notes } = req.body;

    const expense = await AdsExpense.findByIdAndUpdate(
      id,
      {
        platform,
        amount,
        date,
        notes: notes || ''
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Ads expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ads expense updated successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAdsExpense = async (req, res, next) => {
  try {
    const expense = await AdsExpense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Ads expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ads expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
