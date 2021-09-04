'use strict';


const { Router } = require('express');
var fileupload = require('express-fileupload');
const Admin = require('../model/admin')
const cors = require('cors');
var token = require("../middleware/genratetoken")
var authenticateToken = require("../middleware/verifytoken")





let admin_api = Router();
admin_api.use(fileupload());
admin_api.use(cors());



//create Admin
admin_api.post('/create', async (req, res) => {
  try{
  const login_id = req.body.login_id;

  const admin_present = await Admin.findOne({ login_id }).lean()
  if (!admin_present) {
    const create = await Admin.create(req.body).catch((error) => {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    })

    if (create != null) {
      return res.status(200).json({ payload: create })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  }
  else {
    return res.status(404).json({ error: "Not Found", message: "user already present" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});

//login Admin
admin_api.post('/login', async (req, res) => {
  try{
  const login_id = req.body.login_id;
  const admin_present = await Admin.findOne({ login_id }).lean()
  if (admin_present) {
    if (admin_present.password == req.body.password) {
      const auth = token.generateAccessToken({ login_id: login_id })
      admin_present.token = auth
      return res.status(200).json({ payload: admin_present })
    } else {
      return res.status(404).json({ error: "Not Found", message: "Password incorrect" })
    }
  }
  else {
    return res.status(404).json({ error: "Not Found", message: "login_id incorrect" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});


module.exports = admin_api;