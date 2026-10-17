require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuración del Pool de MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Compartir el pool de DB con las rutas (opcional, o importarlo en cada controlador)
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Endpoint de prueba (Health Check)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor de SneakerVault activo y escuchando.' 
    });
});

// Importar rutas
const userRoutes = require('./node_modules/routes/users');
const sneakerRoutes = require('./node_modules/routes/sneakers');

// Registrar rutas en Express
app.use('/api/users', userRoutes);
app.use('/api/sneakers', sneakerRoutes);

// Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de SneakerVault corriendo en el puerto ${PORT}`);
});