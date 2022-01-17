const mongoose = require('mongoose');

const URI ="mongodb://admin:admin@cluster0-shard-00-00.elcbh.mongodb.net:27017,cluster0-shard-00-01.elcbh.mongodb.net:27017,cluster0-shard-00-02.elcbh.mongodb.net:27017/development?ssl=true&replicaSet=atlas-hueon9-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
 
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;
