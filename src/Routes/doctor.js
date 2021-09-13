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
var authenticateToken = require("../middleware/verifytoken");
const { set } = require('mongoose');



let doctor_all_api = Router();
doctor_all_api.use(fileupload());
doctor_all_api.use(cors());



//create doctor
doctor_all_api.post('/create', async (req, res) => {
  try {
    const formValues = JSON.parse(req.body.formValues)
    if (req.files) {
      let doctor_avatar = req.files.doctor_avatar;
      const dir = `./tmp/doctor_avatar`;
      fs.mkdir(dir, { recursive: true }, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("New directory successfully created.")
        }
      })
      let doctor_avatar_path = `${dir}/` + (doctor_avatar.name)
      doctor_avatar.mv(doctor_avatar_path, function (err, result) {
        if (err)
          throw err;

      })
      let doctor_avatar_viewurl = "http://localhost:8080/view?filepath=" + doctor_avatar_path;
      console.log(doctor_avatar_viewurl)
      formValues.avatar = doctor_avatar_viewurl
      formValues.avatar_name = formValues.login_id
    }
    const login_id = formValues.login_id;
    const doctor_present = await Doctor.findOne({ login_id }).lean()
    if (!doctor_present) {
      const create = await Doctor.create(formValues).catch((error) => {
        return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
      })

      if (create != null) {
        return res.status(200).json({ payload: true })
      } else {
        return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
      }
    }
    else {
      return res.status(404).json({ error: "Not Found", message: "user already present" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }

});

/*doctor_all_api.get('/token', async (req, res) => {
 
  const auth= token.generateAccessToken({username:"HI"})
   return res.status(200).json({payload:auth})
  
 });*/
/*doctor_all_api.get('/:id/token1',async (req, res) => {
 var id = req.params.id;
 return res.status(200).json({payload:id})
 
});*/


//login doctor
doctor_all_api.post('/login', async (req, res) => {
  try {
    const login_id = req.body.login_id;
    console.log(login_id)
    const doctor_present = await Doctor.findOne({ login_id }).lean()
    if (doctor_present) {
      if (doctor_present.password == req.body.password) {
        const auth = token.generateAccessToken({ login_id: login_id })
        doctor_present.token = auth
        return res.status(200).json({ payload: doctor_present })
      } else {
        return res.status(404).json({ error: "Not Found", message: "Password incorrect" })
      }
    }
    else {
      return res.status(404).json({ error: "Not Found", message: "login_id incorrect" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});


//update the doctor record
doctor_all_api.post('/:id/update1', authenticateToken, async (req, res) => {
  try {
    const formValues = JSON.parse(req.body.formValues)
    if (req.files) {
      let doctor_avatar = req.files.doctor_avatar;
      const dir = `./tmp/doctor_avatar`;
      fs.mkdir(dir, { recursive: true }, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("New directory successfully created.")
        }
      })
      let doctor_avatar_path = `${dir}/` + (doctor_avatar.name)
      doctor_avatar.mv(doctor_avatar_path, function (err, result) {
        if (err)
          throw err;
      })
      let doctor_avatar_viewurl = "http://localhost:8080/view?filepath=" + doctor_avatar_path;
      console.log(doctor_avatar_viewurl)
      formValues.avatar = doctor_avatar_viewurl
      formValues.avatar_name = formValues.login_id
    }
    const login_id = req.query;
    const modify = { $set: formValues };
    const doctor_update = await Doctor.updateOne(login_id, modify)
    if (doctor_update.nModified == 1) {
      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

//remove doctor info
doctor_all_api.delete('/:id/remove', authenticateToken, async (req, res) => {
  try {
    const login_id = req.query.login_id;
    const doctor_remove = await Doctor.deleteOne({ login_id: login_id })

    if (doctor_remove.deletedCount == 1) {

      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

//get all doctor with hospital id doctor info
doctor_all_api.get('/:id/forhospital', authenticateToken, async (req, res) => {
  try {
    const query = req.query;
    const doctor_hospital_id = await Doctor.find(query)

    if (doctor_hospital_id.length != 0) {

      return res.status(200).json({ payload: doctor_hospital_id })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

//get all doctor
doctor_all_api.get('/:id/', authenticateToken, async (req, res) => {
  try {
    const query = req.query;
    const doctor_all = await Doctor.find({})

    if (doctor_all.length != 0) {

      return res.status(200).json({ payload: doctor_all })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});



doctor_all_api.get('/', async (req, res) => {
  try {
    const query = req.query;
    const hospital_name = "Al Jalilas Children Speciality Hospital"
    const doctor_all = await Doctor.find({ hospital_name })
    //console.log(doctor_all)
    const arr = []

    if (doctor_all.length != 0) {

      for (const dr of doctor_all) {
        arr.push(dr.SPECIALITY)

      }
      console.log(arr.length)
      let uniqueChars = [...new Set(arr)];

      console.log(uniqueChars.length)

      return res.status(200).json({ payload: uniqueChars })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

module.exports = doctor_all_api;
