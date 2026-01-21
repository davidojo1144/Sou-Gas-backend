const axios = require('axios');
const FormData = require('form-data');

const sendEmail = async (options) => {
  const form = new FormData();
  form.append('from', process.env.INFOBIP_EMAIL_FROM || 'noreply@sougas.com');
  form.append('to', options.email);
  form.append('subject', options.subject);
  form.append('text', options.message);
  
  if (options.html) {
    form.append('html', options.html);
  } else {
    // Basic fallback if no HTML provided, though typically we should provide it
    form.append('html', `<div>${options.message}</div>`);
  }

  try {
    // Remove https:// if present in BASE_URL to avoid double protocol or handle cleanly
    // But .env has it. Let's assume .env is correct.
    const baseUrl = process.env.INFOBIP_BASE_URL.replace(/\/$/, ''); // Remove trailing slash if any

    const response = await axios.post(
      `${baseUrl}/email/3/send`,
      form,
      {
        headers: {
          'Authorization': `App ${process.env.INFOBIP_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
