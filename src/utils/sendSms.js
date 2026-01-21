const axios = require('axios');

const sendSms = async (to, text) => {
  try {
    const baseUrl = process.env.INFOBIP_BASE_URL.replace(/\/$/, '');

    const response = await axios.post(
      `${baseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to }],
            from: 'Sou Gas',
            text,
          },
        ],
      },
      {
        headers: {
          'Authorization': `App ${process.env.INFOBIP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('SMS sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    throw new Error('SMS could not be sent');
  }
};

module.exports = sendSms;
