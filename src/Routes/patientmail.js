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
const nodemailer=require('nodemailer');






let sendmail = Router();
sendmail.use(fileupload());
sendmail.use(cors());
sendmail.get('/get', async (req, res) => {
    
  try{
    const enqurie = await enquries.find(req.query)
    return res.status(200).json({ payload: enqurie })
    }
    catch(err) {
      return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    } 
  });


  sendmail.post('/send',async(req,res) => {
    console.log('req.body: ');
    console.log(req.body);
    let Email1=req.body.email;
    console.log(Email1,"Email")
    console.log(req.body.url,"url")
    const _id=req.body.enq_id
    const modify = {
      $set: {
        
        status:"Awaiting From Patients"
      }
    };
    await enquries.updateOne({_id}, modify)

     // send mail with defined transport object
     let transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
     // service:'yahoo',
      secure: false,
      auth: {
         user: 'info@guidemedoc.com',
         pass: 'Dubai@2021'
      },
      debug: false,
      logger: false 
    });
     
    
    var mailOptions = {
        from: 'info@guidemedoc.com',
        to: Email1,
        subject: 'Quotation :: GuideMeDoc',
        html: "<page size = 'A4'>"+
      
        "<img src = 'http://192.46.209.112:8080/view?filepath=./tmp/GuideMeDocLogo.png' alt = '' style = ' position: absolute; height: 100px;width: 200px;top: 0;right: 0;'>"+
        
        " <div style=' padding: 10rem; margin-top: 5rem;'><p>Dear  " +req.body.name+ "</p>"+
           " <h5>Greatings from Guide Me Doc, a unique platform empowering patient's choice inHealthcare!!</h5>"+
           
           " <p>Please find below the link to access your treatment plan and estimates from various hospitals</p>"+
           "<h5 style='font-weight:bold;'>" +req.body.url +"</h5>"+
           " <p style = 'font-style: italic; text-align: center; margin-top: 10rem;'>If you have any further queries, please feel free to call us at<br><b>04 356 2356<br>between<br><b>9 am to 9 pm</b></b></p>"+
       " </div>"
        // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'  
       
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.status(404).json({ error: error, message: "something went wrong pls check filed" })
        } else {
            if(info.response==="250 OK , completed")

            return res.status(200).json({ payload: "sended successfully" })
        }
      });
     
      
    
});


  module.exports = sendmail;