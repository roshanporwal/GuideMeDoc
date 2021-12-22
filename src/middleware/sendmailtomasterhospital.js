const nodemailer=require('nodemailer');
 
 
 
 module.exports = async function sendmailtohospital(req, res, next) {
 const Email1 = req.login_id 
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
let html = `
<html lang="en-US">

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!-- 100% body table -->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tbody>
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <a href="#">
                                        <img width="210"
                                            src="http://192.46.209.112:8080/view?filepath=./tmp/GuideMeDocLogo.png">
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tbody>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 15px;">
                                                    <h1
                                                        style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                        Get started
                                                    </h1>
                                                    <p
                                                        style="font-size:15px; color:#455056; margin:8px 0 0; line-height:24px;">
                                                        <strong>
                                                            Congratulations !! Your Master account for Hospital ${req.hospital_name} is now on the panel of
                                                            GuideMeDoc.<br> Please find your login details
                                                            below</strong>.</p>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p
                                                        style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">
                                                        <strong
                                                            style="display: block;font-size: 13px; margin: 0 0 4px; color:rgba(0,0,0,.64); font-weight:normal;">Username</strong>${req.login_id}
                                                        <strong
                                                            style="display: block; font-size: 13px; margin: 24px 0 4px 0; font-weight:normal; color:rgba(0,0,0,.64);">Password</strong>${req.password}
                                                    </p>
                                                    <a href="http://guidemedoc.com/home"
                                                        style="background:#34316E;text-decoration:none !important; display:inline-block; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Login
                                                        to your Account</a>
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
                                    <p style="font-size:14px; color:#455056bd; line-height:18px; margin:0 0 0;"><strong>Click</strong><a href="http://guidemedoc.com/"> here</a> if link doesn't work</p>
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

</html>`


var mailOptions = {
    from: 'info@guidemedoc.com',
    to: Email1,
    subject: 'Account Details :: Guide Me Doc',
    html:html
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'  
   
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        return res.status(404).json({ error: error, message: "something went wrong pls check filed" })
    } else {

        next();
    }
  });
}