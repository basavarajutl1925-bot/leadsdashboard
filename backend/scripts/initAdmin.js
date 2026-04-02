const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function initializeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@dashboard.com',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'admin',
      status: 'active'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📝 Default credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Please change password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    process.exit(1);
  }
}

initializeAdmin();
