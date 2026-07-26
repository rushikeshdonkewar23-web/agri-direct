const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors()); // CORS Enable केले
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files (public folder serve करणे)
app.use(express.static('public'));

// User Model Import (Try-Catch Safe)
let User;
try {
  User = require('./models/User');
} catch (e) {
  User = require('./models/user');
}

// Product Model Import (Try-Catch Safe)
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

// 🚀 MOBILE QUICK LOGIN API (फिक्स केलेला स्पेशल JWT रूट)
app.post('/api/auth/mobile-login', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    // 1. युझर शोधणे किंवा डेटाबेसमध्ये नवीन तयार करणे
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

    // 2. ओरिजिनल JWT Token तयार करणे (JWT Secret वापरून)
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

// Home Route -> Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ================= ADMIN ROUTES =================

// 1. Get All Users List
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Admin Fetch Users Error:", err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// 2. Delete User
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Admin Delete User Error:", err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

// 3. Delete Specific Crop/Product (Admin Action)
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error("Admin Delete Product Error:", err);
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// ================= SEED DATA =================

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

// Auto Insert function
async function populateSampleData() {
  try {
    const count = await Product.countDocuments();
    if (count < 3) {
      await Product.insertMany(seedProducts);
      console.log('🌾 Sample Agri Products populated successfully!');
    }
  } catch (err) {
    console.log('Sample data insertion skipped:', err.message);
  }
}

// Start Server & Run DB Seed
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  populateSampleData();
});