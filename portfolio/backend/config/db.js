const mongoose = require('mongoose');
const { mongoUri } = require('./env');

mongoose.set('strictQuery', true);

async function connectDB() {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDB;
