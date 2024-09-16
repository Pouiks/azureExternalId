const { getAccessToken } = require('../services/authService');
const { defaultConfig, anotherConfig } = require('../config');

async function getDefaultAccessToken(req, res) {
  try {
    const token = await getAccessToken(defaultConfig);
    res.json({ accessToken: token });
  } catch (error) {
    res.status(500).send('Error fetching default access token.');
  }
}

async function getAnotherAccessToken(req, res) {
  try {
    const token = await getAccessToken(anotherConfig);
    res.json({ accessToken: token });
  } catch (error) {
    res.status(500).send('Error fetching another access token.');
  }
}

module.exports = { getDefaultAccessToken, getAnotherAccessToken };
