'use strict';

const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  // how would we validate upload size?
  comment: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  }
}, {
    timestamps: true,
});

uploadSchema.virtual('length').get(function () {
  return this.text.length; // what is 'text'?
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;