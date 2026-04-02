const Lead = require('../models/Lead');
const smsService = require('../utils/smsService');
const locationService = require('../utils/locationService');

const buildLeadFilter = (query = {}) => {
  const { source, startDate, endDate } = query;
  const filter = {};

  if (source) {
    filter.source = source;
  }

  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = inclusiveEndDate;
    }
  }

  return filter;
};

// Create a new lead
exports.createLead = async (req, res, next) => {
  try {
    const { name, email, phone, source, city, country, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    // Create lead with all provided information
    const lead = new Lead({
      name,
      email,
      phone,
      message: message || '',
      source: source || 'direct',
      city: city || 'Unknown',
      country: country || 'Unknown',
      status: 'new'
    });

    await lead.save();

    // Send notification via SMS/WhatsApp if Twilio is configured
    if (smsService.isConfigured()) {
      try {
        // Format phone number for Twilio (remove spaces, add + prefix if missing)
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+' + formattedPhone;
        }

        // Generate personalized notification message
        const notification = smsService.generateLeadNotification(
          name,
          source || 'direct',
          city || 'Unknown'
        );

        console.log(`\n📧 Sending WhatsApp notification to ${name} (${formattedPhone})`);
        
        // Send via WhatsApp directly (SMS would fail due to account setup)
        let messageResult = await smsService.sendWhatsApp(formattedPhone, notification);

        if (messageResult && messageResult.success) {
          lead.messageSid = messageResult.messageSid;
          lead.messageStatus = messageResult.status;
          lead.messageSentAt = new Date();
          await lead.save();
          console.log(`✅ Notification sent via ${messageResult.type}: ${messageResult.messageSid}\n`);
        } else {
          console.log(`⚠️ Notification failed: ${messageResult.error}\n`);
          lead.messageStatus = 'failed';
          lead.messageError = messageResult.error;
        }
      } catch (notificationError) {
        console.error(`⚠️ Notification send failed: ${notificationError.message}`);
        // Don't fail the lead creation if notification fails
      }
    } else {
      console.log('⚠️ Twilio not configured - no notification sent');
    }

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    next(error);
  }
};

// Get all leads with filters
exports.getAllLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = buildLeadFilter(req.query);

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get leads and total count
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get lead statistics
exports.getLeadStats = async (req, res, next) => {
  try {
    const filter = buildLeadFilter(req.query);

    const stats = await Lead.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const total = await Lead.countDocuments(filter);

    // Format response
    const formattedStats = {
      total,
      bySource: {}
    };

    stats.forEach(stat => {
      formattedStats.bySource[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
};

// Get lead by ID
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Update lead
exports.updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating critical fields
    delete updates.createdAt;

    const lead = await Lead.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Delete lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get message status
exports.getMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead || !lead.messageStatus) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Update message status from Twilio
    if (lead.messageStatus.messageSid) {
      try {
        const whatsappService = require('../utils/whatsappService');
        const statusUpdate = await whatsappService.getMessageStatus(
          lead.messageStatus.messageSid
        );
        lead.messageStatus.status = statusUpdate.status;
        await lead.save();
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: lead.messageStatus
    });
  } catch (error) {
    next(error);
  }
};
