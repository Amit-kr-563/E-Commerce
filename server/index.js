require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Connection = require('./database/db');
const Routes = require('./router/route');
const paymentRoutes = require("./router/paymentRoutes");
const mongoose = require('mongoose');


const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use("/api/payment", paymentRoutes);
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to database and fix old indexes
Connection();

// Drop old userId index from carts collection
setTimeout(async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'carts' }).toArray();
    
    if (collections.length > 0) {
      const indexes = await db.collection('carts').indexes();
      const hasOldIndex = indexes.some(index => index.name === 'userId_1_productId_1');
      
      if (hasOldIndex) {
        await db.collection('carts').dropIndex('userId_1_productId_1');
        console.log('✅ Dropped old userId index from carts collection');
      }
    }
  } catch (error) {
    console.log('Note: Could not drop old index (may not exist):', error.message);
  }
}, 2000);

app.use('/', Routes);
const cartRoutes = require('./router/cart-routes');
app.use("/", cartRoutes);
const watchlistRoutes = require('./router/watchlist');
app.use(watchlistRoutes);
const orderRoutes = require('./router/order');
app.use("/", orderRoutes);
const productRoutes = require('./router/product-routes');
app.use("/", productRoutes);
const reviewRoutes = require('./router/review-routes');
app.use("/", reviewRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
