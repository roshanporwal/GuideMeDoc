"use strict";

const { Router } = require("express");
const bodyParser = require("body-parser");
const util = require("util");
const path = require("path");
const fs = require("fs");
var fileupload = require("express-fileupload");
const enquries = require("../model/enquries");
const generatePassword = require("../Api/password");
const cors = require("cors");
var authenticateToken = require("../middleware/verifytoken");
var isadmin = require("../middleware/isadmin");
const nodemailer = require("nodemailer");
var constants = require("../constant");

let sendmail = Router();
sendmail.use(fileupload());
sendmail.use(cors());
sendmail.get("/get", async (req, res) => {
  try {
    const enqurie = await enquries.find(req.query);
    return res.status(200).json({ payload: enqurie });
  } catch (err) {
    return res
      .status(404)
      .json({ error: err, message: "something went wrong pls check filed" });
  }
});

sendmail.post("/send", async (req, res) => {
  console.log("req.body: ");
  console.log(req.body);
  let Email1 = req.body.email;
  console.log(Email1, "Email");
  console.log(req.body.url, "url");
  const _id = req.body.enq_id;
  const modify = {
    $set: {
      status: "Awaiting From Patients",
    },
  };

  // send mail with defined transport object
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 587,
    // service:'yahoo',
    secure: false,
    auth: {
      user: "info@guidemedoc.com",
      pass: "Dubai@2021",
    },
    debug: false,
    logger: false,
  });

  let html = `<html lang="en-US">
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tbody>
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <a href="#">
                                        <img width="210"
                                            src="${constants.apiBaseURL}/view?filepath=./tmp/GuideMeDocLogo.png"
                                            alt="Docuclip Logo">
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tbody>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 15px;">
                                                    <h1
                                                        style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                        Dear ${req.body.name}</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p
                                                        style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        <strong>Greetings from Guide Me Doc, A unique platform
                                                            empowering patient's choice in Healthcare!!</strong><br>
                                                        Please click below to access your treatment plan and estimates
                                                        from various hospitals
                                                    </p>
                                                    <a href="${req.body.url}"
                                                        style="background:#34316E;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;
                                                                text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                        Access</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:#455056bd; line-height:18px; margin:0 0 0;">
                                        If you have any further queries, please feel free to call us at 
                                        <b><a href="tel:04 356 2356">04 356 2356</a></b>
                                        betweeen <b>9 am to 9 pm</b>
                                        </p>

                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <!--/100% body table-->


</body>

</html>`;

  var mailOptions = {
    from: "info@guidemedoc.com",
    to: Email1,
    subject: "Quotation :: GuideMeDoc",
    html: html,
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      return res.status(404).json({
        error: error,
        message: "something went wrong pls check filed",
      });
    } else {
      await enquries.updateOne({ _id }, modify);
      return res.status(200).json({ payload: "sended successfully" });
    }
  });
});

module.exports = sendmail;
