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
const  generatePassword  = require('../Api/password');
const cors = require('cors');





let fileuplaodaddtodatabase = Router();
fileuplaodaddtodatabase.use(fileupload());
fileuplaodaddtodatabase.use(cors());


fileuplaodaddtodatabase.post('', async (req, res) => {
    

    let file = req.files.blogimage;
    const dir = `./tmp/`;
    fs.mkdir(dir, { recursive: true }, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("New directory successfully created.")
        }
    })
    let path1 = `${dir}/` + (file.name)
    await file.mv(path1)
    var workbook = XLSX.readFile(path1);
    var sheet_name_list = workbook.SheetNames;
    var hospital_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var doctor_hospital_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);

    const Hospital_Name = hospital_data[0].Hospital_Name;
    const Google_location = hospital_data[0].Google_location;
    const login_id = hospital_data[0].Hospital_Name.replace(/\s/g, "");
   // const login_id = hospital_data[0].login_id;


    const hospital_present = await Hospital.findOne({ login_id }).lean()
    if (!hospital_present) {
        const password= "admin"//generatePassword(12);
        await Hospital.create({
            Hospital_Name,
            Google_location,
            login_id,
            password
            
        })
    }
    for (const dr of doctor_hospital_data) {

        const SPECIALITY = dr.SPECIALITY;
        const DOCTOR_NAME = dr.DOCTOR_NAME;
        const sub_speciality = dr.sub_speciality;
        const languages = dr.languages;
        const CHARGES = dr.CHARGES;
        const login_id = dr.DOCTOR_NAME.replace(/\s/g, "")
        const doctor = await Doctor.findOne({ login_id }).lean()
        const password= "admin"//generatePassword(12);



        if (!doctor) {
            await Doctor.create({
                SPECIALITY,
                DOCTOR_NAME,
                login_id,
                sub_speciality,
                languages,
                CHARGES,
                Hospital_Name,
                password
            })



        }
    }
   
    fs.unlinkSync(path1)
   

    res.send("All Done")












});
module.exports = fileuplaodaddtodatabase;
