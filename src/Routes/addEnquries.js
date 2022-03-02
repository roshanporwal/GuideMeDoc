'use strict';


const { Router } = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
var fileupload = require('express-fileupload');
const enquries = require('../model/enquries');
const enquriesFromPatient = require('../model/enquriespatient');
const feedback = require('../model/feedback')
const generatePassword = require('../Api/password');
const cors = require('cors');
var authenticateToken = require("../middleware/verifytoken")
var isadmin = require("../middleware/isadmin")
var constants = require("../constant")





let addEnquries = Router();
addEnquries.use(fileupload());
addEnquries.use(cors());

//get all enquries
addEnquries.get('/:id', [authenticateToken, isadmin], async (req, res) => {
  try {
    const enqurie = await enquries.find({})
    return res.status(200).json({ payload: enqurie })
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});
addEnquries.get('/:id/patient/:patient', [authenticateToken, isadmin], async (req, res) => {
  try {
    const enqurie = await enquries.find({_id:req.params.patient})
    return res.status(200).json({ payload: enqurie })
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

addEnquries.get('/admin111', async (req, res) => {
  try {

    const enqurie = await enquries.find({})
    const enquriesstatus = [];
    for (const en of enqurie) {

      enquriesstatus[0].total += 1
      if (en.status === "new") {
        enquriesstatus[0].new += 1
      } else if (en.status === "Awaiting From Hospital" || en.status === "Awaiting From Patients") {
        if (en.status === "Awaiting From Hospital") {
          enquriesstatus[0].inProgress += 1
        } else {
          enquriesstatus[0].sentQuote += 1
        }
        enquriesstatus[0].awaiting += 1
      } else if (en.status === "Won Patients") {
        enquriesstatus[0].won += 1
      } else {
        enquriesstatus[0].lost += 1
      }

    }
    return res.status(200).json({ payload: enquriesstatus })
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

//get enquries with quries
addEnquries.get('/:id/id', authenticateToken, async (req, res) => {
  try {
    const enqurie = await enquries.find(req.query)
    return res.status(200).json({ payload: enqurie })
  }
  catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});


//get enquries with hospital login id
addEnquries.get('/:id/hospital', authenticateToken, async (req, res) => {
  try {
    const hospital_id = req.query.hospital_id;
    const enqurie = await enquries.find({
      hospitals: {
        $elemMatch: {
          hospital_id: hospital_id
        }
      }
    })
    return res.status(200).json({ payload: enqurie })
  }
  catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

//update enquries
addEnquries.post('/:id/update', authenticateToken, async (req, res) => {
  try {
    const _id = req.query;
    const modify = { $set: req.body };
    const enquries1 = await enquries.updateOne(_id, modify)
    if (enquries1.nModified == 1) {
      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  }
  catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});



//add hospital in enquries
addEnquries.post('/:id/addhospitals', [authenticateToken, isadmin], async (req, res) => {
  try {
    const _id = req.query;
    let hospitals = [];
    const enquries_present = await enquries.findOne({ _id }).lean()
    if (enquries_present.hospitals === undefined) {
      enquries_present.hospitals = []
    }
    hospitals = enquries_present.hospitals
    for (const value of req.body) {
      if (enquries_present.hospitals.find(item => item.hospital_id === value.value)) {
      } else {
        hospitals.push({
          hospital_id: value.value,
          hospital_name: value.label,
          status: "new"
        })
      }
    }
    const modify = {
      $set: {
        hospitals: hospitals,
        status: "Awaiting From Hospital"
      }
    };
    const enquries1 = await enquries.updateOne(_id, modify)
    if (enquries1.nModified == 1) {
      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }

});

addEnquries.post('/:id/hospital/won', authenticateToken, async (req, res) => {
  try {
    const _id = { _id: req.query.enquries_id };

    let data = req.body;
    let hospital_name;

    // console.log(req.query)
    // console.log(_id)
    let hospitals = [];
    const enquries_present = await enquries.findOne({ _id }).lean()
    hospitals = enquries_present.hospitals

    for (let i = 0; i < enquries_present.hospitals.length; i++) {
      if (enquries_present.hospitals[i].hospital_id === req.query.hospital_id) {


        hospitals[i].status = "Won Patients";
        hospitals[i].value = data.transaction
        hospitals[i].commision = data.commission
        hospital_name = hospitals[i].hospital_name

      } else {
        hospitals[i].status = "Lost Patients";
      }
    }

    const modify = {
      $set: {
        hospitals: hospitals,
        status: "Won Patients",
        value: data.transaction,
        commission: data.commission,
        hospital_name: hospital_name,
      }
    };
    console.log(modify)
    const enquries1 = await enquries.updateOne(_id, modify)
    if (enquries1.nModified == 1) {
      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }

});



addEnquries.get('/:id/hospital/loss', authenticateToken, async (req, res) => {
  try {
    const _id = { _id: req.query.enquries_id };
    let hospitals = [];
    const enquries_present = await enquries.findOne({ _id }).lean()
    hospitals = enquries_present.hospitals

    for (let i = 0; i < enquries_present.hospitals.length; i++) {

      hospitals[i].status = "Lost Patients";
      hospitals[i].patient_lost_reason=req.query.patient_lost_reason

    }

    const modify = {
      $set: {
        hospitals: hospitals,
        status: "Lost Patients",
        patient_lost_reason:req.query.patient_lost_reason
      }
    };
    console.log(modify)
    const enquries1 = await enquries.updateOne(_id, modify)
    if (enquries1.nModified == 1) {
      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }

});



addEnquries.post('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    let data = req.body;
    const enquries1 = await feedback.create(data)
    if (enquries1) {
      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }

});

addEnquries.post('/:id/hospital/sendquote', authenticateToken, async (req, res) => {
  try {
    const _id = { _id: req.query.enquries_id };
    const data = req.body
    // console.log(req.query)
    // console.log(_id)
    let hospitals = [];
    const enquries_present = await enquries.findOne({ _id }).lean()
    hospitals = enquries_present.hospitals

    for (let i = 0; i < enquries_present.hospitals.length; i++) {
      if (enquries_present.hospitals[i].hospital_id === req.query.hospital_id) {
        data.hospital_name = enquries_present.hospitals[i].hospital_name
        data.hospital_id = req.query.hospital_id;
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
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }

});
//remove doctor info
addEnquries.delete('/:id/remove', authenticateToken, async (req, res) => {
  try {
    const login_id = req.query;

    const doctor_remove = await enquries.deleteOne(login_id)


    if (doctor_remove.deletedCount == 1) {

      return res.status(200).json({ payload: true })
    } else {
      return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
    }
  } catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

//add new enquries
addEnquries.post('/:id/create', authenticateToken, async (req, res) => {
  try {

    const formValues = JSON.parse(req.body.formValues)
    const dir = `./tmp/${formValues.patient_name}`;
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
    return res.status(200).json({ payload: true })
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }


});
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}
function convert(str) {
  if(str){
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("/");
  }
  else return ""
}
function convertTime(str) {
  if(str){
    var d = new Date(str);
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    var ampm = "am";
    if (hr > 12) {
      hr -= 12;
      ampm = "pm";
    }
    return hr + ":" + min + " " + ampm;
  }
  else 
    return ""
}
 //get enquries with quries
 addEnquries.get('/:id/transfer',  [authenticateToken, isadmin],async (req, res) => {
  try {
    var enquriesFromPatien = await enquriesFromPatient.findOne(req.query)
    var languagePrefer = []
    languagePrefer.push(enquriesFromPatien.languages_prefer)
    var formValues = {
      identification_document:enquriesFromPatien.identification_document,
      insurance_card_copy:enquriesFromPatien.insurance_card_copy,
      reports:enquriesFromPatien.reports,
      patient_name:enquriesFromPatien.name,
      patient_email:enquriesFromPatien.email,
      patient_mobile:enquriesFromPatien.mobile,
      patient_nationality:enquriesFromPatien.nationality,
      patient_gender:enquriesFromPatien.gender,
      current_diagnosis:enquriesFromPatien.current_diagnosis,
      patient_referred_by:enquriesFromPatien.referredby,
      type:enquriesFromPatien.referredby,
      subtype:enquriesFromPatien.subtype,
      languages_spoken:languagePrefer,
      current_diagnosis:enquriesFromPatien.subtype,
      patient_age:getAge(enquriesFromPatien.dob),
      proposal_date: convert(enquriesFromPatien.preferred_date_first),
      proposal_date_time_first: convertTime(enquriesFromPatien.preferred_date_first),
      proposal_date_second: convert(enquriesFromPatien.preferred_date_second),
      proposal_date_time_second: convertTime(enquriesFromPatien.preferred_date_second),
      insurance_name: enquriesFromPatien.insurance_name,
      location: enquriesFromPatien.location,
      enquiry_date: convert(enquriesFromPatien.enquiry_date),
      family: enquriesFromPatien.family,
      patient_address: enquriesFromPatien.address_patient,
      map_link: enquriesFromPatien.map_link,
      payment_mode: enquriesFromPatien.payment_mode,
      time_period: enquriesFromPatien.time_period,
      nursing_date_range: enquriesFromPatien.nursing_date_range,
      status:"New"
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
    await enquriesFromPatient.deleteOne(req.query)

    return res.status(200).json({ payload: creq._id })
  }
  catch (err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});
addEnquries.get('/:id/admin/status', [authenticateToken, isadmin], async (req, res) => {
  try {

    const enqurie = await enquries.find({})
    const enquriesstatus = {
      total: 0,
      new: 0,
      awaiting: 0,
      lost: 0,
      won: 0,
      sentquote: 0,
      inprogress: 0,

    }

    for (const en of enqurie) {

      enquriesstatus.total += 1
      if (en.status === "New") {
        enquriesstatus.new += 1
      } else if (en.status === "Awaiting From Hospital" || en.status === "Awaiting From Patients") {
        if (en.status === "Awaiting From Hospital") {
          enquriesstatus.inprogress += 1
        } else {
          enquriesstatus.sentquote += 1
        }
        enquriesstatus.awaiting += 1
      } else if (en.status === "Won Patients") {
        enquriesstatus.won += 1
      } else if (en.status === "Lost Patients") {
        enquriesstatus.lost += 1
      }

    }
    return res.status(200).json({ payload: [enquriesstatus] })
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});


addEnquries.get('/:id/hospitalstatus', authenticateToken, async (req, res) => {
  try {
    const id = req.query.id
    const enqurie = await enquries.find({})
    const enquriesstatus = {
      total: 0,
      new: 0,
      awaiting: 0,
      lost: 0,
      won: 0,
      sentquote: 0,
      inprogress: 0,

    }

    for (const enq of enqurie) {
      const en = enq.hospitals.find(item => item.hospital_id === id)
      if (en === undefined) {
        continue
      }

      enquriesstatus.total += 1
      if (en.status === "new") {
        enquriesstatus.new += 1
      } else if (en.status === "Awaiting From Hospital" || en.status === "Awaiting From Patients") {
        if (en.status === "Awaiting From Hospital") {
          enquriesstatus.inprogress += 1
        } else {
          enquriesstatus.sentquote += 1
        }
        enquriesstatus.awaiting += 1
      } else if (en.status === "Won Patients") {
        enquriesstatus.won += 1
      } else {
        enquriesstatus.lost += 1
      }

    }
    return res.status(200).json({ payload: [enquriesstatus] })
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});

addEnquries.get('/:id/allfeedback', authenticateToken,async (req, res) => {
  try {
  
    const fe = await feedback.find({})
    
    return res.status(200).json({ payload:fe  })
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  }
});




module.exports = addEnquries;
