const { body, validationResult } = require('express-validator');

const validateLead = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ min: 10 })
    .withMessage('Phone must be at least 10 digits'),
  
  body('source')
    .optional()
    .isIn(['instagram', 'facebook', 'whatsapp', 'direct', 'email', 'phone', 'website'])
    .withMessage('Invalid source'),

  body('city')
    .optional()
    .trim(),

  body('country')
    .optional()
    .trim(),

  body('message')
    .optional()
    .trim()
];

const validateAdsExpense = [
  body('platform')
    .trim()
    .notEmpty()
    .withMessage('Platform is required')
    .isIn(['Instagram', 'Facebook', 'LinkedIn', 'Other'])
    .withMessage('Platform must be Instagram, Facebook, LinkedIn, or Other'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than 0'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be valid'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be 500 characters or less')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateLead,
  validateAdsExpense,
  handleValidationErrors
};
