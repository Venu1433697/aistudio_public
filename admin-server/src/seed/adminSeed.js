const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aistudio1';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Clear existing admins to ensure we set the correct passwords
  await Admin.deleteMany({});
  console.log('Cleared existing admins');

  const admins = [];
  for (let i = 1; i <= 10; i++) {
    const passwordPlain = `Admin${i}@123`;
    const hashed = await bcrypt.hash(passwordPlain, 10);

    admins.push({
      firstName: `Admin${i}`,
      lastName: '',
      email: `admin${i}@example.com`,
      password: hashed,
      mobile: '',
      gender: ''
    });
    console.log(`Prepared Admin${i} with password ${passwordPlain}`);
  }

  await Admin.insertMany(admins);
  console.log('Seeded 10 admins successfully');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
