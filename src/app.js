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


const Port = process.env.Port || 8080;


app.listen(Port, () => console.log('Server started'));