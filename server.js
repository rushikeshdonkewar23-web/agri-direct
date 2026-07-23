const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files (public folder serve karne)
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Home Route -> Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;

// Admin Routes: Get All Users & Delete User
const User = require('./models/User'); // किंवा तुमच्या User Model चा पाथ

// 1. Get All Users List
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// 2. Delete User
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// Bulk Seed Sample Agri Products (Auto-populate Marketplace)
const seedProducts = [
  {
    title: "Organic Soyabean (सोयाबीन)",
    category: "Soyabean",
    price: 4850,
    unit: "Quintal",
    quantityAvailable: 100,
    district: "Nanded",
    image: "https://images.unsplash.com/photo-1599599810694-b5b37304c03d?w=500"
  },
  {
    title: "Premium Quality Kapus (कापूस)",
    category: "Cotton",
    price: 7200,
    unit: "Quintal",
    quantityAvailable: 50,
    district: "Yavatmal",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=500"
  },
  {
    title: "Rajapuri Turmeric / Halad (हळद)",
    category: "Halad",
    price: 13500,
    unit: "Quintal",
    quantityAvailable: 30,
    district: "Sangli",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500"
  },
  {
    title: "Fresh White Onions (कांदा)",
    category: "Vegetables",
    price: 22,
    unit: "kg",
    quantityAvailable: 1500,
    district: "Nashik",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500"
  },
  {
    title: "Organic Tur Pulse (तूर)",
    category: "Tur",
    price: 9800,
    unit: "Quintal",
    quantityAvailable: 80,
    district: "Latur",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"
  },
  {
    title: "Fresh Red Pomegranates (डाळिंब)",
    category: "Fruits",
    price: 110,
    unit: "kg",
    quantityAvailable: 400,
    district: "Solapur",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500"
  }
];

// Auto Insert function (if database is empty)
async function populateSampleData() {
  try {
    const Product = require('./models/Product'); // किंवा तुमच्या प्रोजेक्टमधील Product Model चा मार्ग
    const count = await Product.countDocuments();
    if (count < 3) {
      await Product.insertMany(seedProducts);
      console.log('🌾 Sample Agri Products populated successfully!');
    }
  } catch (err) {
    console.log('Sample data insertion skipped:', err.message);
  }
}

// Call after DB Connection
populateSampleData();