const nodemailer=require('nodemailer');
 
 
 
 module.exports = async function sendmailtohospital(req, res, next) {
 const Email1 = req.login_id 
 // send mail with defined transport object
 let transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service:'yahoo',
    secure: true,
    auth: {
       user: 'guidemedoc@yahoo.com',
       pass: 'yeyasegsscekuiac'
    },
    debug: false,
    logger: true 
});
 

var mailOptions = {
    from: 'guidemedoc@yahoo.com',
    to: Email1,
    subject: 'Account Details :: Guide Me Doc',
    html: "<page size = 'A4'>"+
  
    "<img src = 'http://proctologyalliance.com/view?filepath=./tmp/GuideMeDocLogo.png' alt = '' style = ' position: absolute; height: 100px;width: 200px;top: 0;right: 0;'>"+
    
    " <div style=' padding: 10rem; margin-top: 5rem;'>"+
      "<h5>Congratulations !! Your hospital is now on panel of GuideMeDoc. Please find your login details below</h5>"+
       " <h5>Your login_id : "+ req.login_id+"</h5>"+" <h5>Password : "+req.password+"</h5>"+
       
      
   " </div> </page>"
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'  
   
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        return res.status(404).json({ error: error, message: "something went wrong pls check filed" })
    } else {
        if(info.response==="250 OK , completed")

        next();
    }
  });
}