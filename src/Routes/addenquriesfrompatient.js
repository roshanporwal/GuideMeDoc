'use strict';


const { Router } = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
var fileupload = require('express-fileupload');
const enquries = require('../model/enquriespatient');
const generatePassword = require('../Api/password');
const cors = require('cors');
var authenticateToken = require("../middleware/verifytoken")
var isadmin = require("../middleware/isadmin")
var constants = require("../constant")





let addEnquriespatient = Router();
addEnquriespatient.use(fileupload());
addEnquriespatient.use(cors());



addEnquriespatient.get('/:id/enquiry/:patient', [authenticateToken, isadmin], async (req, res) => {
  try {
    const enqurie = await enquries.find({_id:req.params.patient})
    return res.status(200).json({ payload: enqurie })
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});
addEnquriespatient.get('/:id/:spec', [authenticateToken, isadmin], async (req, res) => {
  let search = []
  if(req.params.spec === "new_consultation"){
    search.push("new_consulation")
    search.push("new_consultation")
  }
  else if(req.params.spec === "free_opinion"){
    search.push("free_surgical_opinion")
    search.push("interational_expert_opinion")
  }
  else if(req.params.spec === "home_care_services"){
    search.push("rcpcrtest")
    search.push("teleconsulation")
    search.push("doctorhomevist")
    search.push("physiotherapy")
    search.push("nursingservice")
  }
  else if(req.params.spec === "lab_tests"){
    search.push("lab")
  }
  else if(req.params.spec === "diagnostic"){
    search.push("xray")
    search.push("mammogram")
    search.push("ctscan")
    search.push("mri")
    search.push("ultrasound")
  }
  else if(req.params.spec === "pharmacy"){
    search.push("pharmacy")
  }
  try {
    if(req.params.spec === "null"){
      const enqurie = await enquries.find({})
      return res.status(200).json({ payload: enqurie })
    }
    const enqurie = await enquries.find({type:search})
    return res.status(200).json({ payload: enqurie })
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});
//add new enquries
addEnquriespatient.post('/:id/create',authenticateToken, async (req, res) => {
  try {
    console.log("hi")

    const formValues = JSON.parse( req.body.formValues)
    console.log(formValues)
    const dir = `./tmp/${formValues.name}`;
    formValues.reports = []

    if (req.files !== null) {


      //check insurance_card_copy is present or not
      if (req.files.insurance_card_copy) {
        
        
        let insurance = req.files.insurance_card_copy;
        fs.mkdir(dir, { recursive: true }, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log("New directory successfully created.")
          }
        })
        let insurance_path = `${dir}/` + (insurance.name)
        let insurance_viewurl = constants.apiBaseURL + "/view?filepath=" + insurance_path;
        let insurance_downloadurl = constants.apiBaseURL + "/download?filepath=" + insurance_path;
        formValues.insurance_card_copy = [insurance_viewurl, insurance_downloadurl]
        insurance.mv(insurance_path, function (err, result) {
          if (err)
            throw err;

        })
      }
      //check for patient_document present or not
      if (req.files.patient_document) {
        let identification = req.files.patient_document;
        fs.mkdir(dir, { recursive: true }, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log("New directory successfully created.")
          }
        })
        let identification_path = `${dir}/` + (identification.name)
        let identification_viewurl = constants.apiBaseURL + "/view?filepath=" + identification_path;
        let identification_downloadurl = constants.apiBaseURL + "/download?filepath=" + identification_path;
        formValues.identification_document = [identification_viewurl, identification_downloadurl];

        identification.mv(identification_path, function (err, result) {
          if (err)
            throw err;
        })
      }
      //check for patient_reports present or not
      if (req.files.patient_reports) {
        if (req.files.patient_reports.length === undefined) {
          let patient_report = req.files.patient_reports;
          fs.mkdir(dir, { recursive: true }, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("New directory successfully created.")
            }
          })

          let patient_report_path = `${dir}/` + (patient_report.name)
          let patient_report_viewurl = constants.apiBaseURL + "/view?filepath=" + patient_report_path;
          let patient_report_downloadurl = constants.apiBaseURL + "/download?filepath=" + patient_report_path;
          formValues.reports = [patient_report_viewurl, patient_report_downloadurl];
          patient_report.mv(patient_report_path, function (err, result) {
            if (err)
              throw err;

          })


        } else {

          for (const rp of req.files.patient_reports) {
            let patient_report = rp;
            fs.mkdir(dir, { recursive: true }, function (err) {
              if (err) {
                console.log(err)
              } else {
                console.log("New directory successfully created.")
              }
            })

            let patient_report_path = `${dir}/` + (patient_report.name)
            let patient_report_viewurl = constants.apiBaseURL + "/view?filepath=" + patient_report_path;
            let patient_report_downloadurl = constants.apiBaseURL + "/download?filepath=" + patient_report_path;
            formValues.reports.push(patient_report_viewurl)
            formValues.reports.push(patient_report_downloadurl)
            patient_report.mv(patient_report_path, function (err, result) {
              if (err)
                throw err;

            })
          }
        }
      }
    }
    const creq = await enquries.create(formValues)

    let date = new Date();
    let year = date.getFullYear().toString()
    date = date.toJSON().split('-')
    let final = year[3] + date[2][0] + date[2][1] + date[1] + "_" + creq._id
    console.log(final)
    const modify = {
      $set: {
        id: final
      }
    };
    const _id = {
      _id: creq._id
    }
    await enquries.updateOne(_id, modify)

    return res.status(200).json({ payload: creq })
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }


});






module.exports = addEnquriespatient;
