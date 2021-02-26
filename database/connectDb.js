const mongoose = require('mongoose');

const URL =
  'mongodb+srv://admin-soumya:itsmemongo12345@shopchat-dev-cluster.zh7dj.mongodb.net/razorpayDemo?retryWrites=true&w=majority';

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
