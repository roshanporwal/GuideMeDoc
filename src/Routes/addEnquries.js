'use strict';


const { Router } = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
var fileupload = require('express-fileupload');
const enquries = require('../model/enquries');
const  generatePassword  = require('../Api/password');
const cors = require('cors');





let addEnquries = Router();
addEnquries.use(fileupload());
addEnquries.use(cors());


addEnquries.get('', async (req, res) => {
   
    const enqurie=await enquries.find({})
     return res.status(200).json({payload:enqurie})
});
addEnquries.get('/id', async (req, res) => {
  const enqurie=await enquries.find( req.query)
   return res.status(200).json({payload:enqurie})
});

addEnquries.post('/create', async (req, res) => {
  
 // return res.status(200).json({payload:JSON.parse(req.body.formValues)})
  
 let insurance = req.files.insurance_card_copy;
  const formValues =JSON.parse(req.body.formValues)
 

  let identification = req.files.patient_document;
  let patient_report=req.files.patient_reports;
  
  const dir=`./tmp/${formValues.patient_name}`;

  fs.mkdir(dir, { recursive: true }, function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("New directory successfully created.")
  }
})
  console.log(dir)
    
  let insurance_path=`${dir}/` + (insurance.name)
  let identification_path=`${dir}/` + (identification.name)
  let patient_report_path=`${dir}/` + (patient_report.name)
  let insurance_viewurl="http://localhost:8080/view?filepath="+insurance_path;
  let insurance_downloadurl="http://localhost:8080/download?filepath="+insurance_path;

  let identification_viewurl="http://localhost:8080/view?filepath="+identification_path;
  let identification_downloadurl="http://localhost:8080/download?filepath="+identification_path;

  let patient_report_viewurl="http://localhost:8080/view?filepath="+patient_report_path;
  let patient_report_downloadurl="http://localhost:8080/download?filepath="+patient_report_path;

 formValues.insurance_card_copy=[insurance_viewurl,insurance_downloadurl]
 formValues.identification_document=[identification_viewurl,identification_downloadurl];
 formValues.reports=[patient_report_viewurl,patient_report_downloadurl];
  
  insurance.mv(insurance_path, function(err, result) {
   if(err) 
    throw err;
   
  })
  identification.mv(identification_path, function(err, result) {
    if(err) 
     throw err;
    
   })
   patient_report.mv(patient_report_path, function(err, result) {
    if(err) 
     throw err;
    
   })
   //console.log(JSON.stringify(formValues))
   
  const enqurie=await enquries.create(formValues)
   return res.status(200).json({payload:enqurie})
});
module.exports = addEnquries;
