// auth user controller
const {mongoUrl}=require('../bin/keys');
const mongoose=require('mongoose');
require('../models/loginSchema')
require('../models/customerSchema')
const login = mongoose.model('login');
const customer=mongoose.model('customer');
exports.customerLogin = function(request, response) {
    var post_data=request.body;
    var email=post_data.email;
    var userPassword=post_data.password;
        //var db=client.db('Diolo');
    login.find({"email":email}).countDocuments(function(err,number){
        if(number==0){
                response.send("email not exists");
                console.log("email not exists");
        }
        else{
            login.findOne({'email':email},function(err,user){
                //var salt=user.salt;
                //var hashed_password=checkHashPassword(userPassword,salt).passwordHash;
                //var encrypted_password=user.password;
                //if(hashed_password==encrypted_password){
                response.send("login Successful");
                console.log("login successful");
                //}
                /*else{       
                        response.send("wrong email id or password");
                        console.log("wrong email id or password");
                    
                  }*/
                    
                })
            }
        })
};

exports.customerSignup = function(request, response) {
    var post_data=request.body;
    var password=post_data.password;
    //var hash_data=saltHashPassword(plaint_password);
    //var password=hash_data.passwordHash;
    //var salt=hash_data.salt;
    var name=post_data.name;
    var email=post_data.email;
    var phone=post_data.phone;
    var insertJson={
        'name':name,
        'email':email,
        'phone':phone,
        'password':password,
          
    };
    //var db=client.db('Diolo');
    customer.find({"email":email}).count(function(err,number){
        if(number!=0){
            response.json("email already exists");
            console.log("email already exists");
        }
        else{
            const user = new customer({name,email,phone});
            user.save();
            const userLogin = new login({email,phone,password});
            userLogin.save();
                response.json("Registration Successful");
                console.log("registration success");
        
        }
    })
};