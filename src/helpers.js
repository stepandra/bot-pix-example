// src/helpers.js
const axios = require('axios');
const { sendOrderToProviders } = require('./bot');
const {saveOrder} = require('./database');

async function handleCreateOrder(orderData) {
  // Get the USDT/BRL rate from Huobi
//   const response = await axios.get(`${process.env.HUOBI_API_URL}/market/trade?symbol=usdtbrl`);
  const response = await axios.get('https://api.huobi.pro/market/trade', {
    params: {
        symbol: 'usdtbrl'
    },
    headers: {
        'Access-Key': process.env.HUOBI_API_KEY
    }
});
  const rate = response.data.tick.data[0].price;

  // Calculate the amount in USDT
  const usdtAmount = orderData.amount / rate;
  const orderId = await saveOrder(orderData.pix_address, orderData.amount, usdtAmount);
  await sendOrderToProviders({ ...orderData, orderId, usdtAmount });

  // ... Add any other necessary steps
}

module.exports = {
  handleCreateOrder,
};
