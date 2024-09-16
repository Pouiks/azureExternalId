const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Définir le moteur de templates
app.set('view engine', 'ejs');

// Middleware pour analyser les données des formulaires
app.use(express.urlencoded({ extended: true }));

// Routes pour l'authentification
app.use('/', authRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
