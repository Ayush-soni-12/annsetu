const { Resend } = require('resend');
const templates = require('../utils/emailTemplates');

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');
const FROM_EMAIL = 'Annsetu <noreply@neuralcontrol.online>';

const sendWelcomeEmail = async (email, name) => {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping email send: No RESEND_API_KEY found');
    return;
  }
  
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Annsetu! 🍱',
      html: templates.getWelcomeEmailHtml(name),
    });
    console.log('Welcome email sent:', data);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendNgoWelcomeEmail = async (email, orgName) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your NGO registration is under review 🏢',
      html: templates.getNgoWelcomeEmailHtml(orgName),
    });
    console.log('NGO Welcome email sent:', data);
  } catch (error) {
    console.error('Error sending NGO welcome email:', error);
  }
};

const sendDonationConfirmation = async (email, donorName, foodName, serves) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your donation has been received! ✅',
      html: templates.getDonationConfirmationHtml(donorName, foodName, serves),
    });
    console.log('Donation confirmation email sent:', data);
  } catch (error) {
    console.error('Error sending donation confirmation email:', error);
  }
};

const sendNgoApprovalEmail = async (email, orgName) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your NGO registration has been approved! ✅',
      html: templates.getNgoApprovalEmailHtml(orgName),
    });
    console.log('NGO Approval email sent:', data);
  } catch (error) {
    console.error('Error sending NGO approval email:', error);
  }
};

const sendDonationDeliveredEmail = async (email, userName, ngoName, foodName, serves) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Food Delivered Successfully! 🎊',
      html: templates.getDonationDeliveredEmailHtml(userName, ngoName, foodName, serves),
    });
    console.log('Donation delivered email sent:', data);
  } catch (error) {
    console.error('Error sending donation delivered email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNgoWelcomeEmail,
  sendDonationConfirmation,
  sendNgoApprovalEmail,
  sendDonationDeliveredEmail
};
