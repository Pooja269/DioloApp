'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var serviceProviderSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    //required:'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address!'] 
  },
  phone: {
    type: Number,
    maxlength: 10,
    trim: true,
    unique: true,
    required:'Phone number is required',
    //match: [/\d{3}\d{3}\d{4}/, 'Please enter a valid phone number'] 
  },
  experience:{
    type: Number,
    default:'',
  },
  timeAvailable:{
    type: String,
    default: '',
  },
  gender:{
    type: String,
    default: '',
  },
  serviceName: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    maxlength:20,
    default:'',
  },
  address2: {
    type: String,
    maxlength:30,
    default:'',
  },
  city: {
    type: String,
    maxlength:10,
    default:'',
  },
  state: {
    type: String,
    maxlength:10,
    default:'',
  },
  country: {
    type: String,
    maxlength:5,
    default:'',
  },
  postalcode: {
    type: String,
    maxlength:6,
    default:'',
  },
  /*status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }*/
});

module.exports = mongoose.model('serviceProvider', serviceProviderSchema);