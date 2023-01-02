// server/index.js
const express = require("express");
const cors = require('cors');
require('dotenv').config();
const User = require('./modals/User');

var bodyParser = require("body-parser");
// create application/json parser
var jsonParser = bodyParser.json();

const { diskStorage } = require("multer");
const fs = require("fs");
const util = require("util");
const multer = require("multer");
const crypto = require("crypto");
const unlinkFile = util.promisify(fs.unlink);

const PORT = 8080;

const app = express();
app.use(cors());


// handling disk storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync("./uploads/", { recursive: true });
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    let decode = decodeURIComponent(file.originalname);
    let ext = file.originalname.split(".");
    const uid = crypto.randomBytes(16).toString("hex");
    const fileName = `${ext.slice(0, -1).join('.').replace(/ /g, "_").replace(/\x19/g, "'")}-${uid}.${ext.pop()}`;
    cb(null, fileName);
  },
});

// helps in saving file
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});



app.get('/get/user-data', (req, res) => {
  // Get all Users
  User.findAll().then((response) => {
    console.log('response :', response);
    return res.status(200).send({ code: 200, err: false, data: response });
  }).catch((error) => {
    console.error('Failed to retrieve data : ', error);
    return res.status(400).send({ code: 400, err: true, msg: error });
  });
});


app.post('/create/user-data', upload.single("file"), async (req, res) => {
  const file = req.file;
  const name = req.body.display_name;
  const mobile = req.body.mobile;

  if (!file) {
    res.status(400).send({ msg: "file is missing" });
  }
  else if (!name) {
    res.status(400).send({ msg: "name is missing" });
  }
  else if (!mobile) {
    res.status(400).send({ msg: "mobile is missing" });
  }
  else{
    // Create User
    User.create({
      display_name: name,
      image: file.filename,
      mobile: mobile,
      created_at: Date.now(),
      updated_at: Date.now()
    })
      .then(() => {
        res.send({ code: 200, msg: 'user created' })
      })
      .catch((err) => {
        console.log(err);
        res.send({ code: 400, msg: 'user not created'  })
      })
  }
});


app.post('/update/user-data', jsonParser, (req, res) => {
  const name = req.body.userName;
  const mobile = req.body.mobile;
  const preUserName = req.body.preUserName;
  console.log('name :', name);
  console.log('mobile :', mobile);

  if (!name) {
    res.status(400).send({ msg: "name is missing" });
  }
  else if (!mobile) {
    res.status(400).send({ msg: "mobile is missing" });
  }
  else if (!preUserName) {
    res.status(400).send({ msg: "preUserName is missing" });
  }
  else{
    // Update Users
    User.update({
      display_name: name,
      mobile: mobile
    }, {
      where: { display_name: preUserName }
    })
    .then(() => {
      return res.status(200).send({ code: 200, err: false, msg: "Updated Successfully" });
    })
    .catch((error) => {
      console.error('Failed to retrieve data : ', error);
      return res.status(400).send({ code: 400, err: true, msg: error });
    });
  }
});


app.post('/delete/user-data', jsonParser, (req, res) => {
  const {userName, fileName} = req.body;

  if (!userName) {
    res.status(400).send({ msg: "userName is missing" });
  }
  else if (!fileName) {
    res.status(400).send({ msg: "fileName is missing" });
  }
  else{
    // Delete Users
    User.destroy({
      where: {display_name : userName},
    })
    .then(async() => {
      // delete file after upload
      await unlinkFile(`./uploads/${fileName}`);
      return res.status(200).send({ code: 200, err: false, data: "Deleted Successfully" });
    }).catch((error) => {
      console.error('Failed to retrieve data : ', error);
      return res.status(400).send({ code: 400, err: true, msg: error });
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});