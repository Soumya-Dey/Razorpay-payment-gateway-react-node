require('dotenv').config();
const mongoose = require('mongoose');

const URL = process.env.MONGO_URI;

const connectDb = () => {
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('mongodb connected');
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = connectDb;
