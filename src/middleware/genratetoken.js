const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

  function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }


  

module.exports={generateAccessToken}