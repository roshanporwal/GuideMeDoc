const { Router } = require('express');

const view_download = Router();

const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
view_download.use(cors());

view_download.get('/', async (req, res) => {
    try{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var message = 'It works!\n',
            version = "Now working with my node js version" + '\n',
            response = [message, version].join('\n');
        res.end(response);
    }catch(err) {
      return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    } 
  
  });
view_download.get('/view', async (req, res) => {
    try{
    const abc = req.query;
    console.log(abc);
    const filepath = req.query.filepath;
    console.log(filepath);
    let ext = path.parse(filepath).ext;
    fs.readFile(filepath, (err, data) => {
      if (err) {
        return res.status(200)
      } else {
        res.setHeader("ContentType", `view_downloadlication/${ext}`);
        res.end(data);
      }
    })
    }catch(err) {
      return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    } 
  
  });
  
  view_download.get('/download', async (req, res) => {
    try{
    const filepath = req.query.filepath;
    console.log(filepath);
  
  
    res.download(filepath, (err) => {
      if (err) {
        res.status(404).json({
          message: "Could not download the file. " + err,
        });
      }
    });
  }catch(err) {
    console.log(err)
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
    //res.send(req.body)
  });
  module.exports = view_download;