const express = require('express');
const router = express.Router();
const adsExpenseController = require('../controllers/adsExpenseController');
const {
  validateAdsExpense,
  handleValidationErrors
} = require('../middleware/validators');

router.post(
  '/ads-expenses',
  validateAdsExpense,
  handleValidationErrors,
  adsExpenseController.createAdsExpense
);

router.get('/ads-expenses', adsExpenseController.getAdsExpenses);
router.get('/ads-expenses/summary', adsExpenseController.getAdsExpenseSummary);

router.put(
  '/ads-expenses/:id',
  validateAdsExpense,
  handleValidationErrors,
  adsExpenseController.updateAdsExpense
);

router.delete('/ads-expenses/:id', adsExpenseController.deleteAdsExpense);

module.exports = router;
