const express = require('express');
const connectDB = require('./DB/.Conncection.js');
const app = express();

const bodyParser = require('body-parser');
const util = require('util');
const path = require('path');
var https = require('https');
var debug = require('debug')('bkserver:server');
var fs = require('fs');
const cors = require('cors');
var http = require('http');


connectDB();
app.use(express.json({ extended: false }));
app.use('/api', require('./Routes/viewanddownload'));
app.use('/api/doctor', require('./Routes/doctor'));
app.use('/api/enquries', require('./Routes/addEnquries'));

app.use('/api/uploadexcel', require('./Routes/upladfile'));
app.use('/api/smartsearch', require('./Routes/smartsearch'));
app.use('/api/admin', require('./Routes/admin'));
app.use('/api/hospital', require('./Routes/hospital'));
app.use('/api/sendmail', require('./Routes/patientmail'));
app.use('/api/patient', require('./Routes/patient'));
app.use('/api/patientenquries', require('./Routes/addenquriesfrompatient'));

app.use(cors());




const Port = process.env.Port || 8080;

app.listen(Port, () => console.log('Server started'));


// var server = http.createServer(app);

// server.on('error', onError);
// server.on('listening', onListening)


// app.set('secPort',Port+23);

// const certDir = `/etc/letsencrypt/live`;
// const domain = `guidemedoc.com`;
// const options = {
//   key: fs.readFileSync(`${certDir}/${domain}/privkey.pem`),
//   cert: fs.readFileSync(`${certDir}/${domain}/fullchain.pem`)
// };

//   var secureServer = https.createServer(options,app);
//   secureServer.listen(app.get('secPort'), () => {
//     console.log('Server listening on port ',app.get('secPort'));
//  });
//  secureServer.on('error', onError);
//  secureServer.on('listening', onListening);

//  /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//     if (error.syscall !== 'listen') {
//       throw error;
//     }
  
//     var bind = typeof Port === 'string'
//       ? 'Pipe ' + Port
//       : 'Port ' + Port;
  
//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//       case 'EACCES':
//         console.error(bind + ' requires elevated privileges');
//         process.exit(1);
//         break;
//       case 'EADDRINUSE':
//         console.error(bind + ' is already in use');
//         process.exit(1);
//         break;
//       default:
//         throw error;
//     }
//   }
  
//   /**
//    * Event listener for HTTP server "listening" event.
//    */
  
//   function onListening() {
//     var addr = secureServer.address();
//     var bind = typeof addr === 'string'
//       ? 'pipe ' + addr
//       : 'port ' + addr.Port;
//     debug('Listening on ' + bind);
//   }
