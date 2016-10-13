'use strict';

const fs = require('fs');
const fileType = require('file-type');

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
  return Promise.resolve(options);
};

const logMessage = (upload) => {
  // get rid of stream for now, so we can cleanly log rest of options in Terminal
  delete upload.Body;
  // turn pojo into string for better viewing in console
  console.log(`the upload options are ${JSON.stringify(upload)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;