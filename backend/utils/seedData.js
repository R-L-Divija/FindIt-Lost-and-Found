require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const Item = require('../models/Item');

const DEMO_USERS = [
  {
    name: 'Divija R.',
    email: 'divija@findit.local',
    password: 'Password123!',
    role: 'user',
  },
  {
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    password: 'Password123!',
    role: 'user',
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.j@campus.edu',
    password: 'Password123!',
    role: 'user',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.s@campus.edu',
    password: 'Password123!',
    role: 'user',
  },
];

const DEMO_ITEMS = [
  {
    title: 'Blue Laptop Backpack',
    description: 'Dark blue backpack with padded laptop compartment, front zip pocket, and water bottle mesh. Left behind near desk 14.',
    type: 'lost',
    category: 'Bags',
    location: 'Central Library, 2nd Floor Reading Hall',
    date: new Date('2026-10-15'),
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    userIndex: 0,
    status: 'open',
  },
  {
    title: 'iPhone 13 (Midnight Blue)',
    description: 'Midnight blue iPhone with transparent silicone case. Found on the corner dining table. Currently locked.',
    type: 'found',
    category: 'Electronics',
    location: 'Main Block Canteen, Table 12',
    date: new Date('2026-10-18'),
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    userIndex: 1,
    status: 'open',
  },
  {
    title: 'Car & House Keys',
    description: 'Set of 3 keys including a Hyundai car key fob and a brown leather braided keychain.',
    type: 'lost',
    category: 'Keys',
    location: 'East Parking Lot, Near Bay 4',
    date: new Date('2026-10-14'),
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    userIndex: 2,
    status: 'open',
  },
  {
    title: 'Student College ID Card',
    description: 'CSE Department student ID card with purple lanyard. Handed over to reception security desk.',
    type: 'found',
    category: 'ID Cards',
    location: 'Admin Block Reception Desk',
    date: new Date('2026-10-19'),
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80',
    userIndex: 3,
    status: 'open',
  },
  {
    title: 'Apple AirPods Pro (2nd Gen)',
    description: 'White charging case with minor scuffs on the bottom edge. Lost after evening basketball practice.',
    type: 'lost',
    category: 'Electronics',
    location: 'Sports Arena Bleachers',
    date: new Date('2026-10-17'),
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    userIndex: 0,
    status: 'claim_pending',
  },
  {
    title: 'Brown Leather Bi-fold Wallet',
    description: 'Men\'s brown leather wallet containing student transit card and library pass. Safe with security.',
    type: 'found',
    category: 'Documents',
    location: 'Campus Bus Stop 2 Bench',
    date: new Date('2026-10-16'),
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    userIndex: 1,
    status: 'open',
  },
  {
    title: 'Purple Hydro Flask Water Bottle',
    description: 'Stainless steel insulated water bottle with stickers on one side and a loop handle lid.',
    type: 'found',
    category: 'Other',
    location: 'Basketball Court Benches',
    date: new Date('2026-10-18'),
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    userIndex: 2,
    status: 'open',
  },
  {
    title: 'Ray-Ban Matte Black Eyeglasses',
    description: 'Matte black frame prescription reading glasses inside a dark grey case. Very important for exams.',
    type: 'lost',
    category: 'Other',
    location: 'Science Block, Lab Room 302',
    date: new Date('2026-10-13'),
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    userIndex: 3,
    status: 'open',
  },
  {
    title: 'Engineering Mathematics Textbook',
    description: 'Higher Engineering Mathematics 8th Edition by B.S. Grewal. Has highlighted formulas in Chapter 4.',
    type: 'found',
    category: 'Books',
    location: 'Mechanical Dept Seminar Hall',
    date: new Date('2026-10-16'),
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    userIndex: 0,
    status: 'reunited',
  },
  {
    title: 'Silver Chronograph Wristwatch',
    description: 'Silver stainless steel watch with dark blue dial and tachymeter bezel. Family heirloom.',
    type: 'lost',
    category: 'Jewelry',
    location: 'College Auditorium, Row G',
    date: new Date('2026-10-12'),
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    userIndex: 1,
    status: 'open',
  },
  {
    title: 'Oversized Denim Jacket',
    description: 'Light wash denim trucker jacket, size M. Left on the back row seat during the cultural event.',
    type: 'found',
    category: 'Clothing',
    location: 'College Amphitheatre',
    date: new Date('2026-10-17'),
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    userIndex: 2,
    status: 'open',
  },
  {
    title: 'Casio Scientific Calculator FX-991EX',
    description: 'ClassWiz scientific calculator with black sliding cover. Has initials "RS" engraved on the back.',
    type: 'lost',
    category: 'Electronics',
    location: 'Exam Hall 2, Desk 45',
    date: new Date('2026-10-19'),
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    userIndex: 3,
    status: 'open',
  },
];

async function connectToDatabase() {
  const urisToTry = [
    { name: 'Configured URI', uri: process.env.MONGODB_URI },
    { name: 'Localhost MongoDB', uri: 'mongodb://127.0.0.1:27017/lostandfound' },
  ];

  for (const { name, uri } of urisToTry) {
    if (!uri) continue;
    try {
      console.log(`Connecting to ${name}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`Successfully connected to ${name} (${uri.replace(/:[^:@]+@/, ':****@')})`);
      return;
    } catch (err) {
      console.warn(`Could not connect to ${name}: ${err.message}`);
    }
  }

  throw new Error('All database connections failed.');
}

async function seed() {
  try {
    await connectToDatabase();

    console.log('\n--- Seeding Demo Users ---');
    const createdUsers = [];

    for (const u of DEMO_USERS) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        user = await User.create({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
        });
        console.log(`Created user: ${u.name} (${u.email})`);
      } else {
        console.log(`User already exists: ${u.name} (${u.email})`);
      }
      createdUsers.push(user);
    }

    console.log('\n--- Uploading Images to Cloudinary and Seeding Items ---');
    let count = 0;

    for (const itemData of DEMO_ITEMS) {
      const user = createdUsers[itemData.userIndex % createdUsers.length];

      // Check if item with this title already exists
      const existing = await Item.findOne({ title: itemData.title });
      if (existing) {
        console.log(`Item already exists: "${itemData.title}" - skipping`);
        continue;
      }

      let cImageUrl = itemData.imageUrl;
      let cPublicId = '';

      try {
        console.log(`Uploading image for "${itemData.title}" to Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(itemData.imageUrl, {
          folder: 'findit_items',
          transformation: [{ width: 800, height: 600, crop: 'limit' }],
        });
        cImageUrl = uploadResult.secure_url;
        cPublicId = uploadResult.public_id;
        console.log(`  Uploaded to Cloudinary: ${cImageUrl}`);
      } catch (uploadErr) {
        console.warn(`  Cloudinary upload warning: ${uploadErr.message}. Using fallback source URL.`);
      }

      const item = await Item.create({
        title: itemData.title,
        description: itemData.description,
        type: itemData.type,
        category: itemData.category,
        location: itemData.location,
        date: itemData.date,
        imageUrl: cImageUrl,
        imagePublicId: cPublicId,
        status: itemData.status,
        reportedBy: user._id,
      });

      count++;
      console.log(`[${count}] Created item: "${item.title}" (${item.type.toUpperCase()}) by ${user.name}`);
    }

    console.log(`\n Successfully seeded ${count} items with Cloudinary images!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
