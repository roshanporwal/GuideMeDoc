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
app.use('/enquries', require('./Routes/addEnquries'));
app.use('/upladfile', require('./Routes/upladfile'));
app.use('/doctor', require('./Routes/doctor'));
app.use('/hospital', require('./Routes/hospital'));

app.use(cors());

app.get('/view', async (req, res) => {
    const abc =req.query;
    console.log(abc);
    const filepath=req.query.filepath;
    console.log(filepath);
    let ext = path.parse(filepath).ext;
    fs.readFile(filepath,(err,data)=>{
      if(err){
        res.statusCode=500;
        res.end(err);
      }else{
        res.setHeader("ContentType",`application/${ext}`);
        res.end(data);
      }
    })
    
    
  });
  
  app.get('/download', async (req, res) => {
    const filepath=req.query.filepath;
    console.log(filepath);
    
    
    res.download(filepath, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
    //res.send(req.body)
  });


const Port = process.env.Port || 8080;


app.listen(Port, () => console.log('Server started'));