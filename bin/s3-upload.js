'use strict';
// this has to be at the top
// gets export from dotenv, which is an object
// object has a method called config
// executes that method
// this method reads .env and makes variables available via process.env
require('dotenv').config();

const fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

// return a default object when fileType is given unsupported file type
const mimeType = (data) => {
  // Object.assign takes object literal, and writes fileType(data) into it
  // if fileType(data) has keys, default keys will get overwritten/any new keys will be added
  // if fileType(data) is null, then we get back default object
  // default object describes most basic file type: binary file
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = (file) => {
  const options = {
    // get bucket name from AWS S3 console
    Bucket: 'rhj-ga-wdi',
    // attach fileBuffer as stream to send to S3
    Body: file.data,
    // allow anyone to view uploaded file
    ACL: 'public-read',
    // tell S3 what the mimetype is
    ContentType: file.mime,
    // pick a filename for S3 to use for the upload
    Key: `test/test.${file.ext}`
  };
  return new Promise((resolve, reject) => {
    // upload is a web request to S3
    // if successful, we get a response
    // need to do something with that data (likely: save that URL in our DB)
    // node uses "error first, single argument callbacks"
    // S3 uses same style: callback(err, data)
    s3.upload(options, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

const logMessage = (response) => {
  console.log(`the response from AWS was ${JSON.stringify(response)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;