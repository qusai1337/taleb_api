const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

let users = [];

// تسجيل مستخدم جديد
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // فحص الاسم
  const nameExists = users.find(u => u.name === name);
  if (nameExists) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // فحص الإيميل
  if (!email.includes('edu') && !email.includes('student')) {
    return res.status(400).json({ error: 'Email must be a student email (contain "edu" or "student")' });
  }

  // فحص إذا الإيميل موجود سابقاً
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // فحص الباسورد
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };

  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// تسجيل الدخول
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user });
});

let shops = [
  {
    id: 1,
    name: "Ultra Gym",
    discount: "15%",
    location: "Surda",
    category: "gym",
    logo_url: "https://via.placeholder.com/70",
    image_url: "https://via.placeholder.com/400"
  },
  {
    id: 2,
    name: "Gloria Jeans",
    discount: "10%",
    location: "Al-Tireh",
    category: "coffee",
    logo_url: "https://via.placeholder.com/70",
    image_url: "https://via.placeholder.com/400"
  }
];

// عرض كل المحلات
app.get('/shops', (req, res) => {
  res.json(shops);
});

// إضافة محل جديد
app.post('/shops', (req, res) => {
  const newShop = req.body;
  newShop.id = shops.length + 1;
  shops.push(newShop);
  res.status(201).json({ message: 'Shop added successfully', shop: newShop });
});

// تعديل محل
app.put('/shops/:id', (req, res) => {
  const shopId = parseInt(req.params.id);
  const updatedData = req.body;
  const shop = shops.find(shop => shop.id === shopId);

  if (shop) {
    Object.assign(shop, updatedData);
    res.json({ message: 'Shop updated', shop });
  } else {
    res.status(404).json({ error: 'Shop not found' });
  }
});

// حذف محل
app.delete('/shops/:id', (req, res) => {
  const shopId = parseInt(req.params.id);
  const index = shops.findIndex(shop => shop.id === shopId);

  if (index !== -1) {
    const removed = shops.splice(index, 1);
    res.json({ message: 'Shop deleted', shop: removed[0] });
  } else {
    res.status(404).json({ error: 'Shop not found' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API is running on http://localhost:${PORT}`);
});
