// Email templates for Annsetu

const getWelcomeEmailHtml = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
  <h2 style="color: #ea580c; text-align: center;">Welcome to Annsetu! 🍱</h2>
  <p>Hi ${name},</p>
  <p>Thank you for joining <strong>Annsetu</strong>! You've taken the first step towards bridging the gap between surplus food and hunger.</p>
  <p>With Annsetu, you can quickly donate food and we will make sure it reaches the NGOs that need it the most.</p>
  <p>Ready to make an impact?</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://neuralcontrol.online/donate" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Make a Donation</a>
  </div>
  <p>Best,<br/>The Annsetu Team ❤️</p>
</div>
`;

const getNgoWelcomeEmailHtml = (orgName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
  <h2 style="color: #ea580c; text-align: center;">Welcome to Annsetu, ${orgName}! 🏢</h2>
  <p>Hi team,</p>
  <p>Thank you for registering your NGO on <strong>Annsetu</strong>. Your application is currently under review by our admin team.</p>
  <p>Once verified, your NGO will appear in our public directory, and you will be eligible to receive food donations from our donors.</p>
  <p>We will notify you via email as soon as your account is approved.</p>
  <p>Best,<br/>The Annsetu Team ❤️</p>
</div>
`;

const getDonationConfirmationHtml = (donorName, foodName, serves) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
  <h2 style="color: #ea580c; text-align: center;">Donation Received! 🎁</h2>
  <p>Hi ${donorName},</p>
  <p>Thank you for your generous donation on Annsetu!</p>
  <div style="background-color: #fef08a; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h4 style="margin-top: 0;">Donation Details:</h4>
    <ul style="margin-bottom: 0;">
      <li><strong>Food:</strong> ${foodName}</li>
      <li><strong>Serves:</strong> ${serves} people</li>
    </ul>
  </div>
  <p>We are currently matching your donation with the nearest verified NGO. We will notify you once it's assigned and ready for pickup.</p>
  <p>You can track the status of your donation on your dashboard.</p>
  <p>Best,<br/>The Annsetu Team ❤️</p>
</div>
`;

module.exports = {
  getWelcomeEmailHtml,
  getNgoWelcomeEmailHtml,
  getDonationConfirmationHtml
};
