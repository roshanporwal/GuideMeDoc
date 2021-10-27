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
var isadmin = require("../middleware/isadmin")
var constants=require("../constant")





let addEnquries = Router();
addEnquries.use(fileupload());
addEnquries.use(cors());

//get all enquries
addEnquries.get('/:id', [authenticateToken, isadmin], async (req, res) => {
  try{

  const enqurie = await enquries.find({})
  return res.status(200).json({ payload: enqurie })
  }catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
});

addEnquries.get('/admin111',  async (req, res) => {
  try{

  const enqurie = await enquries.find({})
  const enquriesstatus=[];
  for(const en of enqurie){
            
    enquriesstatus[0].total+=1
    if(en.status==="new"){
        enquriesstatus[0].new+=1
    }else if(en.status==="Awaiting From Hospital" ||en.status==="Awaiting From Patients"){
        if(en.status==="Awaiting From Hospital"){
            enquriesstatus[0].inProgress+=1
        }else{
            enquriesstatus[0].sentQuote+=1 
        }
         enquriesstatus[0].awaiting+=1
    }else if(en.status==="Won Patients"){
        enquriesstatus[0].won+=1
    }else{
        enquriesstatus[0].lost+=1
    }
   
}
  return res.status(200).json({ payload: enquriesstatus })
  }catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
});

//get enquries with quries
addEnquries.get('/:id/id', authenticateToken, async (req, res) => {
  try{
  const enqurie = await enquries.find(req.query)
  return res.status(200).json({ payload: enqurie })
  }
  catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
});


//get enquries with hospital login id
addEnquries.get('/:id/hospital', authenticateToken, async (req, res) => {
  try{
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
catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 
});

//update enquries
addEnquries.post('/:id/update', authenticateToken, async (req, res) => {
  try{
  const _id = req.query;
  const modify = { $set: req.body };
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
}
  catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
});



//add hospital in enquries
addEnquries.post('/:id/addhospitals', [authenticateToken, isadmin], async (req, res) => {
  try{
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
        hospital_name:value.label,
        status: "new"
      })
    }
  }
  const modify = {
    $set: {
      hospitals: hospitals,
      status:"Awaiting From Hospital"
    }
  };
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
}catch(err) {
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 

});

addEnquries.post('/:id/hospital/wonandloss', authenticateToken, async (req, res) => {
  try{
  const _id = { _id: req.query.enquries_id };
  
  let data =req.body ;
  let hospital_name;
 
  // console.log(req.query)
  // console.log(_id)
  let hospitals = [];
  const enquries_present = await enquries.findOne({ _id }).lean()
  hospitals = enquries_present.hospitals

  for (let i = 0; i < enquries_present.hospitals.length; i++) {
    if (enquries_present.hospitals[i].hospital_id === req.query.hospital_id) {

      
      hospitals[i].status = "Won Patients";
      hospitals[i].value=data.transaction
      hospitals[i].commision=data.commission
      hospital_name=hospitals[i].hospital_name

    }else{
      hospitals[i].status = "Lost Patients";
    }
  }

  const modify = {
    $set: {
      hospitals: hospitals,
      status:"Won Patients",
      value:data.transaction,
      commission:data.commission,
      hospital_name:hospital_name,
    }
  };
  console.log(modify)
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
  }catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 

});



addEnquries.post('/:id/feedback', authenticateToken, async (req, res) => {
  try{
  const _id = { _id: req.query.enquries_id };
  
  let data =req.body ;
  
  const modify = {
    $set: {
      feedbackrating:data.feedbackrating,
      feedbackmessage:data.feedbackmessage
    }
  };
  console.log(modify)
  const enquries1 = await enquries.updateOne(_id, modify)
  if (enquries1.nModified == 1) {
    return res.status(200).json({ payload: true })
  } else {
    return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
  }
  }catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 

});

addEnquries.post('/:id/hospital/sendquote', authenticateToken, async (req, res) => {
  try{
  const _id = { _id: req.query.enquries_id };
  const data = req.body
  // console.log(req.query)
  // console.log(_id)
  let hospitals = [];
  const enquries_present = await enquries.findOne({ _id }).lean()
  hospitals = enquries_present.hospitals

  for (let i = 0; i < enquries_present.hospitals.length; i++) {
    if (enquries_present.hospitals[i].hospital_id === req.query.hospital_id) {
      data.hospital_name=enquries_present.hospitals[i].hospital_name
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
  }catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 

});

//add new enquries
addEnquries.post('/:id/create', authenticateToken, async (req, res) => {
  try{
    
    const formValues = JSON.parse(req.body.formValues)
    const dir = `./tmp/${formValues.patient_name}`;
    
    if(req.files !==null){

      
  //check insurance_card_copy is present or not
  if(req.files.insurance_card_copy  ){
  
  
    let insurance = req.files.insurance_card_copy;
    fs.mkdir(dir, { recursive: true }, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log("New directory successfully created.")
      }
    })
    let insurance_path = `${dir}/` + (insurance.name)
    let insurance_viewurl = constants.apiBaseURL+"/view?filepath=" + insurance_path;
  let insurance_downloadurl = constants.apiBaseURL+"/download?filepath=" + insurance_path;
  formValues.insurance_card_copy = [insurance_viewurl, insurance_downloadurl]
  insurance.mv(insurance_path, function (err, result) {
    if (err)
      throw err;

  })
  }
  //check for patient_document present or not
  if(req.files.patient_document ){
    let identification = req.files.patient_document;
    fs.mkdir(dir, { recursive: true }, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log("New directory successfully created.")
      }
    })
    let identification_path = `${dir}/` + (identification.name)
    let identification_viewurl = constants.apiBaseURL+"/view?filepath=" + identification_path;
  let identification_downloadurl = constants.apiBaseURL+"/download?filepath=" + identification_path;
  formValues.identification_document = [identification_viewurl, identification_downloadurl];
  
  identification.mv(identification_path, function (err, result) {
    if (err)
      throw err;
  })
  }
   //check for patient_reports present or not
  if(req.files.patient_reports){
  let patient_report = req.files.patient_reports;
  fs.mkdir(dir, { recursive: true }, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log("New directory successfully created.")
    }
  })

  let patient_report_path = `${dir}/` + (patient_report.name)
  let patient_report_viewurl = constants.apiBaseURL+"/view?filepath=" + patient_report_path;
  let patient_report_downloadurl = constants.apiBaseURL+"/download?filepath=" + patient_report_path; 
  formValues.reports = [patient_report_viewurl, patient_report_downloadurl];
  patient_report.mv(patient_report_path, function (err, result) {
    if (err)
      throw err;

  })
}
}
const creq=await enquries.create(formValues)

let date = new Date();
let year=date.getFullYear().toString()
date = date.toJSON().split('-')
let  final =year[3]+date[2][0]+date[2][1]+date[1]+"_"+creq._id
console.log(final)
const modify = {
  $set: {
    id: final
  }
};
const _id = {
  _id:creq._id
}
 await enquries.updateOne(_id, modify)
   
  return res.status(200).json({ payload: true })
}catch(err) {
  console.log(err)
  return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
} 


});


addEnquries.get('/:id/admin/status',[authenticateToken, isadmin],  async (req, res) => {
  try{

  const enqurie = await enquries.find({})
  const enquriesstatus= {
    total: 0,
    new: 0,
    awaiting: 0,
    lost: 0,
    won: 0,
    sentquote:0,
    inprogress:0,

}

  for(const en of enqurie){
            
    enquriesstatus.total+=1
    if(en.status==="New"){
        enquriesstatus.new+=1
    }else if(en.status==="Awaiting From Hospital" ||en.status==="Awaiting From Patients"){
        if(en.status==="Awaiting From Hospital"){
            enquriesstatus.inprogress+=1
        }else{
            enquriesstatus.sentquote+=1 
        }
         enquriesstatus.awaiting+=1
    }else if(en.status==="Won Patients"){
        enquriesstatus.won+=1
    }else if(en.status==="lost Patients"){
        enquriesstatus.lost+=1
    }
   
}
  return res.status(200).json({ payload: [enquriesstatus] })
  }catch(err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
});


addEnquries.get('/:id/hospitalstatus' , authenticateToken, async (req, res) => {
  try{
  const id=req.query.id
  const enqurie = await enquries.find({})
  const enquriesstatus= {
    total: 0,
    new: 0,
    awaiting: 0,
    lost: 0,
    won: 0,
    sentquote:0,
    inprogress:0,

}

  for(const enq of enqurie){
    const en = enq.hospitals.find(item => item.hospital_id === id)
    if(en===undefined){
      continue
    }
       
    enquriesstatus.total+=1
    if(en.status==="new"){
        enquriesstatus.new+=1
    }else if(en.status==="Awaiting From Hospital" ||en.status==="Awaiting From Patients"){
        if(en.status==="Awaiting From Hospital"){
            enquriesstatus.inprogress+=1
        }else{
            enquriesstatus.sentquote+=1 
        }
         enquriesstatus.awaiting+=1
    }else if(en.status==="Won Patients"){
        enquriesstatus.won+=1
    }else{
        enquriesstatus.lost+=1
    }
   
}
  return res.status(200).json({ payload: [enquriesstatus] })
  }catch(err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
});




module.exports = addEnquries;
