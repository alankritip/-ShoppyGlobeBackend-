require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connect
connectDB();

// API Routes
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/', authRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on port', PORT));
