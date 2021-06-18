const mongoose = require('mongoose');

const URL = '<MONGO CONNECTION URI>';

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
