const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = null;
    this.twilioPhone = null;
    this.initialized = false;
    this.initializeIfNeeded();
  }

  initializeIfNeeded() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        this.client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        this.twilioPhone = process.env.TWILIO_SMS_NUMBER || process.env.TWILIO_PHONE_NUMBER;
        this.initialized = true;
        console.log('✅ Twilio SMS Service initialized successfully');
      } catch (error) {
        console.warn('⚠️ Twilio SMS initialization failed:', error.message);
        this.initialized = false;
      }
    } else {
      console.warn('⚠️ Twilio credentials not found in environment variables');
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(toPhoneNumber, message) {
    try {
      if (!this.initialized || !this.client) {
        console.warn('⚠️ Twilio not initialized. SMS not sent.');
        return {
          success: false,
          error: 'Twilio not configured',
          status: 'failed'
        };
      }

      // Ensure phone number has + prefix
      let formattedPhone = toPhoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      console.log(`📱 Sending SMS to: ${formattedPhone}`);

      const result = await this.client.messages.create({
        from: this.twilioPhone,
        to: formattedPhone,
        body: message
      });

      console.log(`✅ SMS sent! SID: ${result.sid}, Status: ${result.status}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status || 'sent',
        type: 'sms'
      };
    } catch (error) {
      console.error('❌ SMS error:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'failed',
        type: 'sms'
      };
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(toPhoneNumber, message) {
    try {
      if (!this.initialized || !this.client) {
        console.warn('⚠️ Twilio not initialized. WhatsApp not sent.');
        return {
          success: false,
          error: 'Twilio not configured',
          status: 'failed'
        };
      }

      // Ensure phone number has + prefix
      let formattedPhone = toPhoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      // Remove 'whatsapp:' prefix if present
      formattedPhone = formattedPhone.replace('whatsapp:', '');

      console.log(`💬 Sending WhatsApp to: ${formattedPhone}`);

      const result = await this.client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886',
        to: `whatsapp:${formattedPhone}`,
        body: message
      });

      console.log(`✅ WhatsApp sent! SID: ${result.sid}, Status: ${result.status}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status || 'sent',
        type: 'whatsapp'
      };
    } catch (error) {
      console.error('❌ WhatsApp error:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'failed',
        type: 'whatsapp'
      };
    }
  }

  /**
   * Send WhatsApp template message
   */
  async sendWhatsAppTemplate(toPhoneNumber, templateSid, variables = {}) {
    try {
      if (!this.initialized || !this.client) {
        console.warn('⚠️ Twilio not initialized. WhatsApp template not sent.');
        return {
          success: false,
          error: 'Twilio not configured',
          status: 'failed'
        };
      }

      // Ensure phone number has + prefix
      let formattedPhone = toPhoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      // Remove 'whatsapp:' prefix if present
      formattedPhone = formattedPhone.replace('whatsapp:', '');

      console.log(`💬 Sending WhatsApp template to: ${formattedPhone}`);

      const result = await this.client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886',
        to: `whatsapp:${formattedPhone}`,
        contentSid: templateSid,
        contentVariables: JSON.stringify(variables)
      });

      console.log(`✅ WhatsApp template sent! SID: ${result.sid}, Status: ${result.status}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status || 'sent',
        type: 'whatsapp_template'
      };
    } catch (error) {
      console.error('❌ WhatsApp template error:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'failed',
        type: 'whatsapp_template'
      };
    }
  }

  /**
   * Send message via preferred channel (SMS -> WhatsApp -> Email as fallback)
   */
  async sendNotification(toPhoneNumber, message, preferredChannel = 'sms') {
    console.log(`📤 Sending notification via ${preferredChannel}`);

    try {
      if (preferredChannel === 'whatsapp') {
        return await this.sendWhatsApp(toPhoneNumber, message);
      } else {
        return await this.sendSMS(toPhoneNumber, message);
      }
    } catch (error) {
      console.error(`❌ Notification failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageSid) {
    try {
      if (!this.initialized || !this.client) {
        throw new Error('Twilio not initialized');
      }

      const message = await this.client.messages(messageSid).fetch();

      console.log(`📊 Message ${messageSid} status: ${message.status}`);

      return {
        status: message.status,
        deliveredAt: message.dateUpdated,
        errorMessage: message.errorMessage || null,
        direction: message.direction,
        from: message.from,
        to: message.to
      };
    } catch (error) {
      console.error('❌ Error fetching message status:', error.message);
      throw error;
    }
  }

  /**
   * Generate lead notification message
   */
  generateLeadNotification(leadName, source, city) {
    return `Thank you for reaching out! 👋\n\nOur team will be connected with you shortly.\n\nBest regards!`;
  }

  /**
   * Check if Twilio is properly configured
   */
  isConfigured() {
    return this.initialized && !!this.client;
  }

  /**
   * Get configuration status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      accountSid: process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing',
      authToken: process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_AUTH_TOKEN !== 'your_auth_token_here' ? '✅ Set' : '❌ Missing or placeholder',
      smsNumber: this.twilioPhone || '❌ Not configured',
      ready: this.initialized && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_AUTH_TOKEN !== 'your_auth_token_here'
    };
  }
}

module.exports = new SMSService();
