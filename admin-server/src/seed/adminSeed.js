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
  const usersToSeed = [
    { email: 'hanisha@gmail.com', password: 'Hani@3697', firstName: 'Hanisha' },
    { email: 'priya@gmail.com', password: 'Priya@1433697', firstName: 'Priya' },
    { email: 'lasya@gmail.com', password: 'Lasya@123', firstName: 'Lasya' }
  ];

  for (const user of usersToSeed) {
    const hashed = await bcrypt.hash(user.password, 10);
    admins.push({
      firstName: user.firstName,
      lastName: '',
      email: user.email,
      password: hashed,
      mobile: '',
      gender: ''
    });
    console.log(`Prepared ${user.firstName} (${user.email})`);
  }

  await Admin.insertMany(admins);
  console.log('Seeded 10 admins successfully');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
