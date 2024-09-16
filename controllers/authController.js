const axios = require('axios');
require('dotenv').config();

// Afficher la page de connexion
function showLoginPage(req, res) {
  res.render('index');
}

// Traiter le formulaire de connexion
async function handleLogin(req, res) {
  const { username, password } = req.body;

  const config = {
    clientId: process.env.DEFAULT_CLIENT_ID,
    clientSecret: process.env.DEFAULT_CLIENT_SECRET,
    tenantId: process.env.DEFAULT_TENANT_ID,
    scope: 'openid profile User.Read',
  };

  try {
    const token = await getAccessToken(config, username, password);
    if (token) {
      const userInfo = await getUserInfo(token);
      res.render('connected', { user: userInfo });
    } else {
      res.send('Authentification échouée. Veuillez réessayer.');
    }
  } catch (error) {
    res.status(500).send('Erreur lors de la connexion.');
  }
}

// Gérer le callback après l'authentification de Microsoft External ID
async function handleAuthCallback(req, res) {
  const code = req.query.code; // Code d'autorisation reçu après authentification réussie

  if (!code) {
    return res.status(400).send('Code d\'autorisation manquant.');
  }

  try {
    // Échanger le code d'autorisation contre un jeton d'accès
    const tokenResponse = await axios.post(`https://login.microsoftonline.com/${process.env.DEFAULT_TENANT_ID}/oauth2/v2.0/token`, new URLSearchParams({
      client_id: process.env.DEFAULT_CLIENT_ID,
      scope: 'openid profile User.Read',
      code: code,
      redirect_uri: 'http://localhost:3000/auth/callback',
      grant_type: 'authorization_code',
      client_secret: process.env.DEFAULT_CLIENT_SECRET
    }));

    const accessToken = tokenResponse.data.access_token;
    const crmId = tokenResponse.data.crm_id; // Récupérer la donnée personnalisée "crm_id"

    // Utiliser crm_id pour récupérer les informations utilisateur depuis Microsoft Dynamics
    const userInfo = await getDynamicsUserInfo(crmId);

    // Stocker le token d'authentification dans la session ou les cookies
    req.session.token = accessToken; // Par exemple, dans la session

    // Rediriger vers la page "connected" avec les informations utilisateur
    res.render('connected', { user: userInfo });
  } catch (error) {
    console.error('Erreur lors de la gestion du callback:', error.response.data);
    res.status(500).send('Erreur lors de la gestion du callback.');
  }
}

// Fonction pour obtenir les informations utilisateur depuis Microsoft Dynamics
async function getDynamicsUserInfo(crmId) {
  try {
    const response = await axios.get(`https://your-dynamics-instance-url/api/data/v9.0/contacts(${crmId})`, {
      headers: {
        Authorization: `Bearer ${process.env.DYNAMICS_ACCESS_TOKEN}` // Utiliser un token d'accès valide pour Dynamics
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'obtention des informations de l\'utilisateur de Dynamics:', error.response.data);
    return null;
  }
}

// Fonction pour obtenir un jeton d'accès avec les informations d'identification utilisateur
async function getAccessToken(config, username, password) {
  const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('client_id', config.clientId);
  params.append('scope', config.scope);
  params.append('username', username);
  params.append('password', password);
  params.append('client_secret', config.clientSecret);
  params.append('grant_type', 'password');

  try {
    const response = await axios.post(url, params);
    return response.data.access_token;
  } catch (error) {
    console.error("Erreur lors de l'obtention du jeton d'accès:", error.response.data);
    return null;
  }
}

// Fonction pour obtenir les informations de l'utilisateur à partir de l'API Microsoft Graph
async function getUserInfo(accessToken) {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'obtention des informations de l'utilisateur:", error.response.data);
    return null;
  }
}

module.exports = { showLoginPage, handleLogin, handleAuthCallback };
