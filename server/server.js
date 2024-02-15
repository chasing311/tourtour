const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./utils/dbConnect')

dotenv.config({ path: '../config.env' });

connectDB();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTIONS! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});