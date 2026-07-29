const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares (50MB Limit Image Upload साठी अत्यंत आवश्यक आहे)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files Serve करणे
app.use(express.static('public'));

// Model Imports (Try-Catch Safe)
let User;
try {
  User = require('./models/User');
} catch (e) {
  User = require('./models/user');
}

let Product;
try {
  Product = require('./models/Product');
} catch (e) {
  Product = require('./models/product');
}

// ================= ROUTES =================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 🚀 MOBILE QUICK LOGIN API
app.post('/api/auth/mobile-login', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: name || 'Farmer_' + phone.slice(-4),
        phone: phone,
        email: email || `${phone}@agridirect.com`,
        password: 'mobile_login_default_pass'
      });
      await user.save();
    }

    const secret = process.env.JWT_SECRET || 'agridirect_secret_key_123';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });

    res.json({
      message: 'Login Successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Mobile Login Error:", err);
    res.status(500).json({ message: 'Server error during mobile login', error: err.message });
  }
});

// Home Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ================= ADMIN ROUTES =================
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// ================= SEED DATA =================
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
  }
];

async function populateSampleData() {
  try {
    const count = await Product.countDocuments();
    if (count < 2) {
      await Product.insertMany(seedProducts);
      console.log('🌾 Sample Agri Products populated successfully!');
    }
  } catch (err) {
    console.log('Sample data insertion skipped:', err.message);
  }
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  populateSampleData();
});