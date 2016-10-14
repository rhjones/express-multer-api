'use strict';

const multer = require('multer');

const storage = multer.memoryStorage(); // don't do this with real apps.
// this fills up storage if one person tries to upload a large file
// jr devs don't usually configure their own multer middleware
// see docs: https://www.npmjs.com/package/multer

module.exports = multer({ storage });
