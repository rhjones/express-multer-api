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

const logMessage = (file) => {
  console.log(`${filename} is ${file.data.length} bytes long and is of mime ${file.mime}`);
};

readFile(filename)
.then(parseFile)
.then(logMessage)
.catch(console.error)
;