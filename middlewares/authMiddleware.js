require('dotenv').config();

// Middleware pour vérifier le token d'authentification
function checkAuthToken(req, res, next) {
  // Vérifie la présence d'un token d'authentification dans les cookies ou la session
  const token = req.session.token || req.cookies.authToken;

  if (!token) {
    // Si aucun token n'est présent, redirige vers Microsoft External ID pour l'authentification
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');
    const authUrl = `https://login.microsoftonline.com/${process.env.DEFAULT_TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.DEFAULT_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=openid%20profile%20User.Read&state=12345`;
    return res.redirect(authUrl);
  }

  // Si un token est présent, passer au middleware suivant
  next();
}

module.exports = { checkAuthToken };
