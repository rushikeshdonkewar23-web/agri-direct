const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares (50MB Limit for Base64 Image Uploads)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Static Files from Public Folder
app.use(express.static('public'));

// Safe Model Imports
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

// ================= EXTENDED SEED DATA FOR FULL MARKETPLACE =================
const seedProducts = [
  {
    title: "Fresh Red Tomatoes (टोमॅटो)",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    quantityAvailable: 500,
    district: "Nashik",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500"
  },
  {
    title: "Organic Potatoes (बटाटा)",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    quantityAvailable: 800,
    district: "Nanded",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500"
  },
  {
    title: "Fresh Farm Onions (कांदा)",
    category: "Vegetables",
    price: 35,
    unit: "kg",
    quantityAvailable: 1200,
    district: "Nashik",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500"
  },
  {
    title: "Sweet Alphonso Mangoes (हापूस आंबा)",
    category: "Fruits",
    price: 650,
    unit: "Quintal",
    quantityAvailable: 150,
    district: "Solapur",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500"
  },
  {
    title: "Fresh Green Bananas (केळी)",
    category: "Fruits",
    price: 40,
    unit: "kg",
    quantityAvailable: 600,
    district: "Latur",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500"
  },
  {
    title: "Pomegranate - Bhagwa (डाळिंब)",
    category: "Fruits",
    price: 120,
    unit: "kg",
    quantityAvailable: 400,
    district: "Sangli",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500"
  },
  {
    title: "High Yield Soyabean (सोयाबीन)",
    category: "Soyabean",
    price: 4850,
    unit: "Quintal",
    quantityAvailable: 250,
    district: "Nanded",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1599599810694-b5b37304c03d?w=500"
  },
  {
    title: "Premium Kapus (कापूस)",
    category: "Cotton",
    price: 7200,
    unit: "Quintal",
    quantityAvailable: 100,
    district: "Yavatmal",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=500"
  },
  {
    title: "Pure Halad Powder Grade (हळद)",
    category: "Halad",
    price: 13400,
    unit: "Quintal",
    quantityAvailable: 80,
    district: "Sangli",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500"
  },
  {
    title: "Sharbati Wheat (गहू)",
    category: "Grains",
    price: 3200,
    unit: "Quintal",
    quantityAvailable: 500,
    district: "Latur",
    phone: "9022554979",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"
  }
];

async function populateSampleData() {
  try {
    const count = await Product.countDocuments();
    if (count < 10) {
      await Product.deleteMany({}); // Reset data once to load all 10 items
      await Product.insertMany(seedProducts);
      console.log('🌾 All 10 Marketplace Products Populated Successfully!');
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

app.delete('/api/crops/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Crop.findByIdAndDelete(id); // तुमच्या Crop Model चे नाव इथे वापरा
        res.status(200).json({ message: "Crop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting crop", error });
    }
});

// DELETE API Endpoint for Products
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        // जर तुम्ही MongoDB (Mongoose) वापरत असाल:
        const deletedProduct = await Product.findByIdAndDelete(productId); 
        
        // (टीप: जर तुमच्या Schema/Model चे नाव 'Crop' असेल तर Product ऐवजी Crop.findByIdAndDelete(productId) वापरा)

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});