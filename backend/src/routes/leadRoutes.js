const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateLead, handleValidationErrors } = require('../middleware/validators');

// Create a new lead
router.post('/leads', validateLead, handleValidationErrors, leadController.createLead);

// Get all leads
router.get('/leads', leadController.getAllLeads);

// Get lead statistics
router.get('/leads/stats', leadController.getLeadStats);

// Get single lead
router.get('/leads/:id', leadController.getLeadById);

// Update lead
router.put('/leads/:id', leadController.updateLead);

// Delete lead
router.delete('/leads/:id', leadController.deleteLead);

// Get message status
router.get('/leads/:id/message-status', leadController.getMessageStatus);

module.exports = router;
