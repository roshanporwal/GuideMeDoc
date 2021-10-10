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
const excel = require('exceljs');
const enquries = require('../model/enquries');
var constants=require("../constant")
var sendmailtohospital = require("../middleware/sendmailtohospital");





let fileuplaodaddtodatabase = Router();
fileuplaodaddtodatabase.use(fileupload());
fileuplaodaddtodatabase.use(cors());

fileuplaodaddtodatabase.get('/hi', async (req, res) => {
    await sendmailtohospital()

})
fileuplaodaddtodatabase.post('', async (req, res) => {
    try {

        for (const fi of req.files.blogimage) {


            let file = fi;
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
            const speciality1 = []
           

            const hospital_name = hospital_data[0].Hospital_Name;
            const google_location = hospital_data[0].Google_location;
            const address = "Mangalmurti Complex,101,1st Floor,Hirabaug, Lokmanya Bal Gangadhar Tilak Rd, Pune, Maharashtra 411002"
            const phno = 9876543210
            const login_id = hospital_data[0].Hospital_Name.replace(/\s/g, "");
            // const login_id = hospital_data[0].login_id;

            let hospital_id;
            const hospital_present = await Hospital.findOne({ login_id }).lean()
            if (!hospital_present) {
                const password = "admin"//generatePassword(12);
                const crhospital = await Hospital.create({
                    hospital_name,
                    google_location,
                    login_id,
                    password,
                    address,
                    phno
                })
                hospital_id = crhospital._id

            } else {
                hospital_id = hospital_present._id
                //insurance=hospital_present.insurance
            }
            for (const dr of doctor_hospital_data) {

                const speciality = dr.SPECIALITY;
                const doctor_name = dr.DOCTOR_NAME;
                const sub_speciality = dr.sub_speciality;
                const languages = dr.languages;
                const charges = dr.CHARGES;
                const login_id = dr.DOCTOR_NAME.replace(/\s/g, "")
                const doctor = await Doctor.findOne({ login_id }).lean()
                const password = "admin"//generatePassword(12);
                speciality1.push(speciality)



                if (!doctor) {
                    await Doctor.create({
                        speciality,
                        doctor_name,
                        login_id,
                        sub_speciality,
                        languages,
                        charges,
                        hospital_id,
                        password
                    })



                }
            }
            const speciality = [...new Set(speciality1)]
         


            const modify = {
                $set: {
                    speciality: speciality,
                   
                }
            };

            await Hospital.updateOne({ login_id }, modify)
            fs.unlinkSync(path1)
        }


        return res.status(200).json({ payload: true})


    } catch (err) {
        console.log(err)
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }









});
fileuplaodaddtodatabase.post('/insurance', async (req, res) => {
    try {

        

           
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
            var insurance_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);
            var doctor_hospital_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
            const speciality1 = []
            let insurance = []
            
            if(!hospital_data[0].Hospital_Name){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check Hospital_Name is not empty and header name is 'Hospital_Name' " })
            }
            if(!hospital_data[0].login_id){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check login_id is not empty and header name is 'login_id' " })
            }
            if(!hospital_data[0].Address){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check Address is not empty and header name is 'Address' " })
            }

            if(!hospital_data[0].PhNo){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check PhNo is not empty and header name is 'PhNo' " })
            }
            if(!hospital_data[0].Speciality){

                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check Speciality of hospital is not empty and header name is 'Speciality' " })
            }


            if(!doctor_hospital_data[0].Speciality){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check Speciality of Doctor is not empty and header name is 'Speciality' " })
            }

            if(!doctor_hospital_data[0].Doctor_Name){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check Doctor_Name is not empty and header name is 'Doctor_Name' " })
            }
            if(!doctor_hospital_data[0].Type){
                fs.unlinkSync(path1)
                return res.status(200).json({ payload: "Pls check Type is not empty and header name is 'Type' " })
            }

            const hospital_name = hospital_data[0].Hospital_Name;
           
            const google_location = hospital_data[0].Google_location;
            const address =  hospital_data[0].Address? hospital_data[0].Address:"Mangalmurti Complex,101,1st Floor,Hirabaug, Lokmanya Bal Gangadhar Tilak Rd, Pune, Maharashtra 411002"
            const phno = hospital_data[0].PhNo? hospital_data[0].PhNo:9876543210
            const login_id = hospital_data[0].login_id?hospital_data[0].login_id:hospital_data[0].Hospital_Name.replace(/\s/g, "");
           
           
            // const login_id = hospital_data[0].login_id;
            const removespace=hospital_data[0].Hospital_Name.replace(/\s/g, "")
        

            let hospital_id;
            const hospital_present = await Hospital.findOne({ login_id }).lean()
            if (!hospital_present) {
                const password = removespace.substring(0, 4)+"1234"//"admin"//generatePassword(12);
                const crhospital = await Hospital.create({
                    hospital_name,
                    google_location,
                    login_id,
                    password,
                    address,
                    phno
                })
                hospital_id = crhospital._id
                //await sendmailtohospital(crhospital)

            } else {
                hospital_id = hospital_present._id
                //insurance=hospital_present.insurance
            }
            for (let i =0 ;i<doctor_hospital_data.length;i++) {
                if(!doctor_hospital_data[i].Speciality){
                    fs.unlinkSync(path1)
                    return res.status(200).json({ payload: `Pls check row number ${i+2} Speciality is not empty and header name is 'Speciality' ` })
                }
    
                if(!doctor_hospital_data[i].Doctor_Name){
                    fs.unlinkSync(path1)
                    return res.status(200).json({ payload: `Pls check  row number ${i+2} Doctor_Name is not empty and header name is 'Doctor_Name' ` })
                }
                if(!doctor_hospital_data[i].Type){
                    fs.unlinkSync(path1)
                    return res.status(200).json({ payload: `Pls check  row number ${i+2}  Type is not empty and header name is 'Type' ` })
                }

                const speciality = doctor_hospital_data[i].Speciality;
                const doctor_name = doctor_hospital_data[i].Doctor_Name;
                const sub_speciality = doctor_hospital_data[i].Sub_Speciality;
                const languages = doctor_hospital_data[i].Languages;
                const charges = doctor_hospital_data[i].Charges;
                const gender=doctor_hospital_data[i].Gender;
                const type = doctor_hospital_data[i].Type;
                const login_id = doctor_hospital_data[i].Doctor_Name.replace(/\s/g, "")
                const doctor = await Doctor.findOne({ login_id }).lean()
                const password = "admin"//generatePassword(12);
                speciality1.push(speciality)



                if (!doctor) {
                    await Doctor.create({
                        speciality,
                        doctor_name,
                        login_id,
                        sub_speciality,
                        languages,
                        charges,
                        hospital_id,
                        password,
                        type,
                        gender
                    })



                }
            }
            const speciality =hospital_data[0].Speciality? hospital_data[0].Speciality.split(','):[...new Set(speciality1)] 
            for (let i =0 ;i<insurance_data.length;i++ ) {
                if(!insurance_data[i].Insurance){
                    fs.unlinkSync(path1)
                    return res.status(200).json({ payload: `Pls check row number ${i+2} Insurance is not empty and header name is 'Insurance' ` })
                }
                if(!insurance_data[i].Type){
                    fs.unlinkSync(path1)
                    return res.status(200).json({ payload: `Pls check row number ${i+2} Type in Insurance is not empty and header name is 'Type' ` })
                }
                const ins = {
                    insurance_company_name: insurance_data[i].Insurance,
                    network: insurance_data[i].Network,
                    type: insurance_data[i].Type

                }
                insurance.push(ins)

            }


            const modify = {
                $set: {
                    speciality: speciality,
                    insurance: insurance
                }
            };

            await Hospital.updateOne({ login_id }, modify)
            fs.unlinkSync(path1)
        


      
        return res.status(200).json({ payload: "All Done" })


    } catch (err) {
        console.log(err)
        fs.unlinkSync(path1)
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }









});
fileuplaodaddtodatabase.post('/file', async (req, res) => {
    try {
        console.log("get it gdfg")
        let hospitals = []
        for (const fi of req.files.blogimage) {

            const login_id = "AlJalilasChildrenSpecialityHospital"
            let file = fi;
            const dir = `./tmp/Nik`;
            fs.mkdir(dir, { recursive: true }, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")
                }
            })
            let path1 = `${dir}/` + (file.name)
            await file.mv(path1)


            // const login_id = hospital_data[0].login_id;
            let image_url = constants.apiBaseURL+"/view?filepath=" + path1;

            const hospital_present = await Hospital.findOne({ login_id }).lean()



            if (hospital_present.images === undefined) {
                hospital_present.images = []
            }
            hospitals = hospital_present.images

            if (hospital_present.images.find(item => item === image_url)) {
                console.log("Done")
                continue
            } else {
                hospitals.push(image_url)
            }
            console.log(hospitals)

            const modify = {
                $set: {
                    images: hospitals
                }
            };

            const enquries1 = await Hospital.updateOne({ login_id }, modify)
            if (enquries1.nModified == 1) {
                continue
            } else {
                return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
            }

        }


        return res.status(200).json({ payload: hospitals })


    } catch (err) {
        console.log(err)
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }









});


fileuplaodaddtodatabase.post('/file1', async (req, res) => {
    try {
        console.log("get it gdfg")
        console.log(req.body)
        /*let hospitals = []

            const login_id = "AlJalilasChildrenSpecialityHospital"
         

            const hospital_present = await Hospital.findOne({ login_id }).lean()



           
            hospitals = hospital_present.images

            if (hospital_present.images.find(item => item === image_url)) {
                console.log("Done")
                continue
            } else {
                hospitals.push(image_url)
            }
            console.log(hospitals)

            const modify = {
                $set: {
                    images: hospitals
                }
            };

            const enquries1 = await Hospital.updateOne({ login_id }, modify)
            if (enquries1.nModified == 1) {
                continue
            } else {
                return res.status(404).json({ error: "Not Found", message: "something went wrong pls check filed" })
            }

        


        return res.status(200).json({ payload: hospitals })*/


    } catch (err) {
        console.log(err)
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }









});

fileuplaodaddtodatabase.get('/nik', async (req, res) => {
    try {




        const hospital_present = await enquries.find({  })
        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
        
        //  WorkSheet Header
        worksheet.columns = [
            { header: 'Id', key: '_id', width: 10 },
            { header: 'patient_name', key: 'patient_name', width: 30 },
            { header: 'patient_email', key: 'patient_email', width: 30},
            { header: 'patient_age', key: 'patient_age', width: 10, outlineLevel: 1},
            { header: 'patient_gender', key: 'patient_gender', width: 10, outlineLevel: 1},
            { header: 'patient_mobile', key: 'patient_mobile', width: 10, outlineLevel: 1},
            { header: 'patient_nationality', key: 'patient_nationality', width: 10, outlineLevel: 1},
            { header: 'patient_referred_by', key: 'patient_referred_by', width: 10, outlineLevel: 1},
            { header: 'hospitals', key: 'hospitals', width: 40},
            { header: 'insurance_card_copy', key: 'insurance_card_copy', width: 40},
            { header: 'identification_document', key: 'identification_document', width: 40},
            { header: 'insurance_name', key: 'insurance_name', width: 40},
            { header: 'feedbackrating', key: 'feedbackrating', width: 40},
            { header: 'feedbackmessage', key: 'feedbackmessage', width: 40}

        ];
        
        // Add Array Rows
        worksheet.addRows(hospital_present);
        
        // Write to File
        workbook.xlsx.writeFile("customer.xlsx")
            .then(function() {
                console.log("file saved!");
            });
       

        res.send("done")
        


    } catch (err) {
        console.log(err)
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }









});




module.exports = fileuplaodaddtodatabase;
