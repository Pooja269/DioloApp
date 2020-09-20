//index
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
mongoose.pluralize(null);
const {mongoUrl} = require('../bin/keys');
const bodyParser=require('body-parser');
var authUsers=require('../controllers/authUserController');
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
var app = express();
var PORT=3000;


mongoose.connect(mongoUrl,{
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
  console.log("connected to mongodb")
})

mongoose.connection.on('error',(err)=>{
  console.log("this is error",err)
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router.post('/login',authUsers.customerLogin);
router.post('/signup-customer',authUsers.customerSignup);
router.post('/signup-provider',authUsers.professionalSignup);
router.put('/forgot-password',authUsers.forgotPassword);
router.put('/reset-password',authUsers.resetPassword);
router.get('/google-signup',authUsers.googleSignup)
router.post('/google-authentication',authUsers.googleAuth)
//router.post('/sendOtp',authUsers.sendOtp);
//router.post('/verify',authUsers.verifyOtp);


app.listen(PORT,()=>{
  console.log("server running "+PORT)
})
app.use("/", router);
module.exports=router;

