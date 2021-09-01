'use strict';


const { Router } = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
var fileupload = require('express-fileupload');
const enquries = require('../model/enquries');
const generatePassword = require('../Api/password');
const cors = require('cors');
var authenticateToken = require("../middleware/verifytoken")





let addEnquries = Router();
addEnquries.use(fileupload());
addEnquries.use(cors());

//get all enquries
addEnquries.get('', authenticateToken, async (req, res) => {

  const enqurie = await enquries.find({})
  return res.status(200).json({ payload: enqurie })
});

//get enquries with quries
addEnquries.get('/id', authenticateToken, async (req, res) => {
  const enqurie = await enquries.find(req.query)
  return res.status(200).json({ payload: enqurie })
});


//get enquries with hospital login id
addEnquries.get('/hospital', authenticateToken, async (req, res) => {
  const hospital_login = req.query.hospital_login;
  const enqurie = await enquries.find({
    hospitals: {
      $elemMatch: {
        hospital_login: hospital_login
      }
    }
  })
  return res.status(200).json({ payload: enqurie })
});

//update enquries
addEnquries.post('/update', authenticateToken, async (req, res) => {
  const _id = req.query;
  const modify = { $set: req.body };
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});



//add hospital in enquries
addEnquries.post('/addhospitals', authenticateToken, async (req, res) => {
  const _id = req.query;
  let hospitals = [];
  const enquries_present = await enquries.findOne({ _id }).lean()
  if (enquries_present.hospitals === undefined) {
    enquries_present.hospitals = []
  }
  hospitals = enquries_present.hospitals
  for (const value of req.body) {
    if (enquries_present.hospitals.find(item => item.hospital_login === value)) {
    } else {
      hospitals.push({
        hospital_login: value,
        status: "new"
      })
    }
  }
  const modify = {
    $set: {
      hospitals: hospitals
    }
  };
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});



addEnquries.post('/hospital/sendquote', authenticateToken, async (req, res) => {
  const _id = { _id: req.query.enquries_id };
  const data = req.body
  // console.log(req.query)
  // console.log(_id)
  let hospitals = [];
  const enquries_present = await enquries.findOne({ _id }).lean()
  hospitals = enquries_present.hospitals

  for (let i = 0; i < enquries_present.hospitals.length; i++) {
    if (enquries_present.hospitals[i].hospital_login === req.query.hospital_login) {

      data.hospital_login = req.query.hospital_login;
      hospitals[i] = data

    }
  }
  const modify = {
    $set: {
      hospitals: hospitals
    }
  };
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
});

//add new enquries
addEnquries.post('/create', authenticateToken, async (req, res) => {
  let insurance = req.files.insurance_card_copy;
  const formValues = JSON.parse(req.body.formValues)
  let identification = req.files.patient_document;
  let patient_report = req.files.patient_reports;
  const dir = `./tmp/${formValues.patient_name}`;
  fs.mkdir(dir, { recursive: true }, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log("New directory successfully created.")
    }
  })
  let insurance_path = `${dir}/` + (insurance.name)
  let identification_path = `${dir}/` + (identification.name)
  let patient_report_path = `${dir}/` + (patient_report.name)
  let insurance_viewurl = "http://localhost:8080/view?filepath=" + insurance_path;
  let insurance_downloadurl = "http://localhost:8080/download?filepath=" + insurance_path;

  let identification_viewurl = "http://localhost:8080/view?filepath=" + identification_path;
  let identification_downloadurl = "http://localhost:8080/download?filepath=" + identification_path;

  let patient_report_viewurl = "http://localhost:8080/view?filepath=" + patient_report_path;
  let patient_report_downloadurl = "http://localhost:8080/download?filepath=" + patient_report_path;

  formValues.insurance_card_copy = [insurance_viewurl, insurance_downloadurl]
  formValues.identification_document = [identification_viewurl, identification_downloadurl];
  formValues.reports = [patient_report_viewurl, patient_report_downloadurl];

  insurance.mv(insurance_path, function (err, result) {
    if (err)
      throw err;

  })
  identification.mv(identification_path, function (err, result) {
    if (err)
      throw err;

  })
  patient_report.mv(patient_report_path, function (err, result) {
    if (err)
      throw err;

  })
  //console.log(JSON.stringify(formValues))

  const enqurie = await enquries.create(formValues)
  return res.status(200).json({ payload: enqurie })
});



module.exports = addEnquries;
