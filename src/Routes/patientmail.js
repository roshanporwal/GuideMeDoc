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





let addEnquries = Router();
addEnquries.use(fileupload());
addEnquries.use(cors());
addEnquries.get('/get', async (req, res) => {
    
  try{
    const enqurie = await enquries.find(req.query)
    return res.status(200).json({ payload: enqurie })
    }
    catch(err) {
      return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    } 
  });


  addEnquries.post('/send',async(req,res) => {
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
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
           user: 'adeshadikane@yahoo.com',
           pass: 'pjfffxpxejhdrhnz'
        },
        debug: false,
        logger: true 
    });
     
   
    var mailOptions = {
        from: 'adeshadikane@yahoo.com',
        to: Email1,
        subject: 'link',
        html: "<h3>link  </h3>"  + "<h1 style='font-weight:bold;'>" +req.body.url +"</h1>"
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


  module.exports = addEnquries;