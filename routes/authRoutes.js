const express = require('express');
const { showLoginPage, handleLogin, handleAuthCallback } = require('../controllers/authController');
const { checkAuthToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour afficher la page de connexion
router.get('/', showLoginPage);

// Route pour traiter le formulaire de connexion
router.post('/login', handleLogin);

// Route pour vérifier le token d'authentification
router.get('/protected', checkAuthToken, (req, res) => {
  res.send('Vous avez accès à cette page protégée !');
});

// Route de callback après l'authentification de Microsoft External ID
router.get('/auth/callback', handleAuthCallback);

module.exports = router;
