const axios = require('axios');

async function bingSearch(contactDetails, apiKey) {
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(contactDetails)}`;
  const headers = { 'Ocp-Apim-Subscription-Key': apiKey };

  try {
    const response = await axios.get(url, { headers });
    const results = response.data.webPages.value;
    return results;
  } catch (error) {
    console.error('Error during Bing search:', error);
    throw error;
  }
}

module.exports = bingSearch;
