require('dotenv').config();
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

// Exemples d'utilisation de la fonction avec des configurations globales
const defaultConfig = {
    clientId: process.env.DEFAULT_CLIENT_ID,
    clientSecret: process.env.DEFAULT_CLIENT_SECRET,
    tenantId: process.env.DEFAULT_TENANT_ID,
    scope: process.env.DEFAULT_SCOPE,
};

const anotherConfig = {
    clientId: process.env.ANOTHER_CLIENT_ID,
    clientSecret: process.env.ANOTHER_CLIENT_SECRET,
    tenantId: process.env.ANOTHER_TENANT_ID,
    scope: process.env.ANOTHER_SCOPE,
};

// Appels de fonction avec des configurations différentes
getAccessToken(defaultConfig).then(token => console.log('Default Access Token:', token));
getAccessToken(anotherConfig).then(token => console.log('Another Access Token:', token));
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
