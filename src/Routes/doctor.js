'use strict';


const { Router } = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
var fileupload = require('express-fileupload');
var XLSX = require('xlsx')
const Hospital = require('../model/hospital')
const Doctor = require('../model/doctor');
const generatePassword = require('../Api/password');
const cors = require('cors');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var token = require("../middleware/genratetoken")
var authenticateToken = require("../middleware/verifytoken")



let doctor_all_api = Router();
doctor_all_api.use(fileupload());
doctor_all_api.use(cors());



/*//create doctor
doctor_all_api.post('/create', async (req, res) => {
  const login_id = req.body.login_id;
  const doctor_present = await Doctor.findOne({  login_id }).lean()
  if (doctor_present) {
    if (doctor_present.password == req.body.password) {
      return res.status(200).json({payload:doctor_present})
    } else {
      return res.status(404).json({error:"Not Found",message:"Password incorrect"})
    }
  }
  else {
    return  res.status(404).json({error:"Not Found",message:"login_id incorrect"})
  }
});*/

/*doctor_all_api.get('/token', async (req, res) => {
 
  const auth= token.generateAccessToken({username:"HI"})
   return res.status(200).json({payload:auth})
  
 });
 doctor_all_api.get('/token1',authenticateToken ,async (req, res) => {
   return res.status(200).json({payload:"done"})
  
 });*/


//login doctor
doctor_all_api.post('/login', async (req, res) => {
  const login_id = req.body.login_id;
  console.log(login_id)
  const doctor_present = await Doctor.findOne({ login_id }).lean()
  if (doctor_present) {
    if (doctor_present.password == req.body.password) {
      const auth = token.generateAccessToken({ username: login_id })
      doctor_present.token = auth
      return res.status(200).json({ payload: doctor_present })
    } else {
      return res.status(404).json({ error: "Not Found", message: "Password incorrect" })
    }
  }
  else {
    return res.status(404).json({ error: "Not Found", message: "login_id incorrect" })
  }
});


//update the doctor record
doctor_all_api.post('/update', authenticateToken, async (req, res) => {
  const login_id = req.query;
  const modify = { $set: req.body };
  const doctor_update = await Doctor.updateOne(login_id, modify)
  if (doctor_update.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});

//remove doctor info
doctor_all_api.delete('/remove', authenticateToken, async (req, res) => {
  const login_id = req.query.login_id;
  const doctor_remove = await Doctor.deleteOne({ login_id: login_id })

  if (doctor_remove.deletedCount == 1) {

    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});

//get all doctor with hospital id doctor info
doctor_all_api.get('/forhospital', authenticateToken, async (req, res) => {
  const query = req.query;
  const doctor_hospital_id = await Doctor.find(query)

  if (doctor_hospital_id.length != 0) {

    return res.status(200).json({ payload: doctor_hospital_id })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});

//get all doctor
doctor_all_api.get('/alldoctor', authenticateToken, async (req, res) => {
  const query = req.query;
  const doctor_all = await Doctor.find({})

  if (doctor_all.length != 0) {

    return res.status(200).json({ payload: doctor_all })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});

module.exports = doctor_all_api;
