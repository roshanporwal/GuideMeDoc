const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

  function generateAccessToken(username) {
    try{

    
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '604800s' });
    }catch(err) {
      return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    } 
  }


  

module.exports={generateAccessToken}