const express = require('express');
const connectDB = require('./DB/Conncection');
const app = express();

const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
const cors = require('cors');



connectDB();
app.use(express.json({ extended: false }));
app.use('', require('./Routes/viewanddownload'));
app.use('/doctor', require('./Routes/doctor'));
app.use('/enquries', require('./Routes/addEnquries'));

app.use('/uploadexcel', require('./Routes/upladfile'));
app.use('/smartsearch', require('./Routes/smartsearch'));
app.use('/admin', require('./Routes/admin'));
app.use('/hospital', require('./Routes/hospital'));
app.use('/sendmail', require('./Routes/patientmail'));
app.use('/patient', require('./Routes/patient'));
app.use('/patientenquries', require('./Routes/addenquriesfrompatient'));

app.use(cors());




const Port = process.env.Port || 8080;
app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "service-worker.js"));
  });
  app.get("*", function response(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

app.listen(Port, () => console.log('Server started'));