//login
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var loginSchema = new Schema({
  user_name:{
    type: String,
    required: true,
    unique: true,
    trim: true
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
    //unique: true,
    //required:'Email address is required',
    //match: [/\d{3}\d{3}\d{4}/, 'Please enter a valid phone number'] 
  },
  password: {
    type: String,
    minlength:8,
    maxlength:100,
    required:true,
  },
  user_type:{
    type: String,
  },
  /*status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }*/
  resetPasswordLink:{
    data: String,
    default: '',
  } 
});

module.exports=mongoose.model('login', loginSchema);