const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.fromNumber = null;
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
        this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
        this.initialized = true;
        console.log('✅ Twilio initialized successfully');
      } catch (error) {
        console.warn('⚠️ Twilio initialization failed:', error.message);
        this.initialized = false;
      }
    }
  }

  async sendMessage(toPhoneNumber, message) {
    try {
      if (!this.initialized || !this.client) {
        console.warn('⚠️ Twilio not initialized. Message not sent.');
        return {
          success: false,
          error: 'Twilio not configured',
          status: 'failed'
        };
      }

      console.log(`📤 Sending WhatsApp to: ${toPhoneNumber}`);

      const result = await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${toPhoneNumber.replace('whatsapp:', '')}`,
        body: message
      });

      console.log(`✅ Message sent! SID: ${result.sid}, Status: ${result.status}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status || 'sent'
      };
    } catch (error) {
      console.error('❌ WhatsApp error:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }

  async sendTemplateMessage(toPhoneNumber, contentSid, variables = {}) {
    try {
      if (!this.initialized || !this.client) {
        console.warn('⚠️ Twilio not initialized.');
        return {
          success: false,
          error: 'Twilio not configured',
          status: 'failed'
        };
      }

      console.log(`📤 Sending template WhatsApp to: ${toPhoneNumber}`);

      const result = await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${toPhoneNumber.replace('whatsapp:', '')}`,
        contentSid: contentSid,
        contentVariables: JSON.stringify(variables)
      });

      console.log(`✅ Template message sent! SID: ${result.sid}`);

      return {
        success: true,
        messageSid: result.sid,
        status: result.status || 'sent'
      };
    } catch (error) {
      console.error('❌ Template WhatsApp error:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }

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
        errorMessage: message.errorMessage || null
      };
    } catch (error) {
      console.error('❌ Error fetching message status:', error.message);
      throw error;
    }
  }

  generateWelcomeMessage(leadName, source, city) {
    return `Hi ${leadName}! 👋\n\nWelcome! We've received your inquiry from ${source.toUpperCase()} in ${city}.\n\nOur team will get back to you soon.\n\nThank you!`;
  }
}

module.exports = new WhatsAppService();
