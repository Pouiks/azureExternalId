const axios = require('axios');

async function getAccessToken(config) {
  const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('client_id', config.clientId);
  params.append('scope', config.scope);
  params.append('client_secret', config.clientSecret);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(url, params);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

module.exports = { getAccessToken };
