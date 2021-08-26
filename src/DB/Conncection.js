const mongoose = require('mongoose');

const URI ="mongodb://dbUser:dbUser@cluster0-shard-00-00.d21pv.mongodb.net:27017,cluster0-shard-00-01.d21pv.mongodb.net:27017,cluster0-shard-00-02.d21pv.mongodb.net:27017/test?ssl=true&replicaSet=atlas-odb0a0-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
 
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;
