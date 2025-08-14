const axios = require('axios');

// Test script for password reset functionality
// Make sure to install axios: npm install axios

const BASE_URL = 'http://localhost:3000/api/v1/users';

async function testPasswordReset() {
  try {
    console.log('🧪 Testing Password Reset Functionality...\n');

    // Step 1: Test forgot password
    console.log('1️⃣ Testing forgot password...');
    const forgotPasswordResponse = await axios.post(`${BASE_URL}/forgotPassword`, {
      email: 'test@example.com' // Replace with an email that exists in your database
    });
    console.log('✅ Forgot password response:', forgotPasswordResponse.data);

    // Step 2: Extract reset token from email (you'll need to check Mailtrap.io)
    console.log('\n2️⃣ Check your Mailtrap.io inbox for the reset token');
    console.log('   The reset URL will be in the email body');
    console.log('   Extract the token from the URL');

    // Step 3: Test reset password (uncomment and modify when you have the token)
    /*
    console.log('\n3️⃣ Testing reset password...');
    const resetToken = 'YOUR_RESET_TOKEN_HERE'; // Replace with actual token
    const resetPasswordResponse = await axios.patch(`${BASE_URL}/resetPassword/${resetToken}`, {
      password: 'newPassword123',
      passwordConfirm: 'newPassword123'
    });
    console.log('✅ Reset password response:', resetPasswordResponse.data);
    */

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the test
testPasswordReset();
