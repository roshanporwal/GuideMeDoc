'use strict';


const { Router } = require('express');
var fileupload = require('express-fileupload');
const Hospital = require('../model/hospital')
const cors = require('cors');
var token = require("../middleware/genratetoken")
var authenticateToken = require("../middleware/verifytoken")
const fs = require('fs');
var constants=require("../constant")
var isadmin = require("../middleware/isadmin")





let hospital_all_api = Router();
hospital_all_api.use(fileupload());
hospital_all_api.use(cors());



//create Hospital
hospital_all_api.post('/create', async (req, res) => {
  try{
  const login_id = req.body.login_id;

  const doctor_present = await Hospital.findOne({ login_id }).lean()
  if (!doctor_present) {
    const create = await Hospital.create(req.body).catch((error) => {
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
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});

//login Hospital
hospital_all_api.post('/login', async (req, res) => {
  try{
  const login_id = req.body.login_id;
  const hospital_present = await Hospital.findOne({ login_id }).lean()
  if (hospital_present) {
    if (hospital_present.password == req.body.password) {
      const auth = token.generateAccessToken({ login_id: login_id })
      hospital_present.token = auth
      return res.status(200).json({ payload: hospital_present })
    } else {
      return res.status(200).json({ error: "Not Found", message: "Password incorrect" })
    }
  }
  else {
    return res.status(200).json({ error: "Not Found", message: "login_id incorrect" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});


//update the Hospital record
hospital_all_api.post('/:id/update', authenticateToken, async (req, res) => {
  try{
    const formValues = req.body.formValues?JSON.parse(req.body.formValues):req.body
    const login_id = req.query;
    if (req.files) {
      let hospital_present = await Hospital.findOne( login_id ).lean()
      if(hospital_present.avatar[0]){
        const pre_file= hospital_present.avatar[0].split("=")
        console.log(pre_file[1])
        fs.unlinkSync(pre_file[1])
      }
     
      let hospital_avatar = req.files.hospital_avatar;
      const dir = `./tmp/hospital_avatar`;
      fs.mkdir(dir, { recursive: true }, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("New directory successfully created.")
        }
      })
      let hospital_avatar_path = `${dir}/` + (hospital_avatar.name)
      hospital_avatar.mv(hospital_avatar_path, function (err, result) {
        if (err)
          throw err;
      })
      let hospital_avatar_viewurl = constants.apiBaseURL+"/view?filepath=" + hospital_avatar_path;
      console.log(hospital_avatar_viewurl)
      formValues.avatar = hospital_avatar_viewurl
      formValues.avatar_name = formValues.login_id

    }

 
  const modify = { $set: formValues };
  const hospital_update = await Hospital.updateOne(login_id, modify)
  let hospital_present = await Hospital.findOne( login_id ).lean()
  const auth = token.generateAccessToken(login_id)
  hospital_present.token = auth
  if (hospital_update.nModified == 1) {
    return res.status(200).json({ payload: hospital_present })
  } else if (hospital_update.n == 1) {
    return res.status(200).json({ payload: false, message: "Already up to date" })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
}catch(err) {
  console.log(err)
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});

//remove Hospital info
hospital_all_api.delete('/:id/remove', authenticateToken, async (req, res) => {
  try{
  const login_id = req.query.login_id;
  const hospital_remove = await Hospital.deleteOne({ login_id: login_id })

  if (hospital_remove.deletedCount == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});

/*//get all doctor with hospital id doctor info
hospital_all_api.get('/forhospital',authenticateToken, async (req, res) => {
  const query = req.query;
  const doctor_hospital_id = await Hospital.find( query )
 
  if (doctor_hospital_id.length != 0) {
   
    return res.status(200).json({payload:doctor_hospital_id})
  } else {
    return res.status(404).json({error:"Not Found",message:"something went wrong pls check filed"})
  } 
});*/

//get all Hospital
hospital_all_api.get('/:id',  [authenticateToken, isadmin], async (req, res) => {
  try{
  const query = req.query;
  const hospital_all = await Hospital.find({})
  if (hospital_all.length != 0) {
    let arr=[];
    for(const hp of hospital_all){
      arr.push({
        label:hp.hospital_name,
        value:hp._id,
        hospital_name:hp.hospital_name,
        login_id:hp.login_id
      })
    }
    return res.status(200).json({ payload: arr })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});


//get all Hospital
hospital_all_api.get('/:id/alldata', [authenticateToken, isadmin], async (req, res) => {
  try{
  const hospital_all = await Hospital.find({})
  if (hospital_all.length != 0) {
    return res.status(200).json({ payload: hospital_all })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});

module.exports = hospital_all_api;
