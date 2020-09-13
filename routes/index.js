//index
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
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
router.post('/signup',authUsers.customerSignup);
/*router.post('/signin',async (req,res,next)=>{
  res.json('hi');
  console.log("index");
});*/

app.listen(PORT,()=>{
  console.log("server running "+PORT)
})
app.use("/", router);
module.exports=router;

