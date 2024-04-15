const express=require('express')
const cors=require('cors');
const dotenv=require('dotenv').config()
const dbConnection = require('./Config/dbConnection');
const multer = require('multer');
const router = require('./Route/Route');
const app=express();
dbConnection()
const bodyParser = require('body-parser');

// Increase the payload size limit to 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const uploader = multer({
    storage: multer.memoryStorage(),
});
app.use(uploader.fields([{ name: 'itemImage' }, {name: 'categoryImage' }]))

const port=process.env.PORT || 5001;
app.use(cors())
app.use(express.json())
app.use('/',router)








app.listen(port,()=>{
    console.log("im lisitening "+port)
})