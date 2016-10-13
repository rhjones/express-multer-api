#!/usr/bin/env node
'use strict';

// line #1 tells script to run in node
// specifies an interpreter for the script
// called a "shebang"

const fs = require('fs');

const filename = process.argv[2] || '';

fs.readFile(filename, (error, data) => {
  if (error) {
    return console.error(error);
  }

  console.log(`${filename} is ${data.length} bytes long`);
});
