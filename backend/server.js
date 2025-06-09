const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 shutting down....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./App');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
// 🛠️ Set Mongoose global settings
mongoose.set('bufferTimeoutMS', 30000);

mongoose
  .connect(DB, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('✅ DB Connection successful!'))
  .catch((err) => {
    console.error('❌ DB Connection error:', err.message);
    process.exit(1); // Force exit if database connection fails
  });

const port = process.env.PORT || '3000';
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

console.log('Environment:', process.env.NODE_ENV);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 shutting down....');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋SIGTERM RECEIVED,Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
