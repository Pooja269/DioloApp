// auth user controller
const {mongoUrl,RESET_PASSWORD_KEY,SENDGRID_API_KEY,CLIENT_URL}=require('../bin/keys');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);
require('../models/loginSchema')
require('../models/customerSchema')
require('../models/serviceProviderSchema')
const login = mongoose.model('login');
const customer=mongoose.model('customer');
const professional=mongoose.model('serviceProvider');
const mb=require('messagebird');
const { google } = require('googleapis');
const OAuth2Data = require('../google-key.json')
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
const saltRounds=10;
exports.customerLogin = function(request, response) {
    var post_data=request.body;
    var userName=post_data.userName;
    var password=post_data.password; 
    login.findOne({'user_name':userName},function(err,user){
            if(!user){
                response.send("Sorry! Given e-mail Id does not exist. Please try with another e-mail.");
            }
            else{
                bcrypt.compare(password, user.password, function(err, res) {
                    if(res) {
                        response.send("Login Successful");
                        console.log("Login successful");
                    } else {
                        response.send("Wrong E-mail Id or password");
                        console.log("Wrong E-mail Id or password");
                    } 
                });
            }
        })
};

exports.customerSignup = function(request, response) {
    var post_data=request.body;
    var plainPassword=post_data.password;
    var name=post_data.name;
    var email=post_data.email;
    var phone=post_data.phone;
    var user_name=email;
    var user_type='C';
    customer.findOne({"email":email}).count(function(err,number){
        if(number!=0){
            response.json("email already exists");
            console.log("email already exists");
        }
        else{
            password=bcrypt.hashSync(plainPassword,saltRounds);
            const user = new customer({name,email,phone});
            user.save();
            console.log("customer Registration Successful");
            const userLogin = new login({email,phone,password,user_name,user_type});
            userLogin.save();
                response.json("Registration Successful");
                console.log("registration success");
        
        }
    })
};

exports.professionalSignup = function(request, response) {
    var post_data=request.body;
    var plainPassword=post_data.password;
    var name=post_data.name;
    var email=post_data.email;
    console.log(email);
    if(!email){
        email='';
    }
    var phone=post_data.phone;
    var serviceName=post_data.serviceName;
    var user_name=phone;
    var user_type='P';
    professional.findOne({"phone":phone}).countDocuments(function(err,number){
        if(number!=0){
            response.json("Service provider with the given phone number already exists");
            console.log("Service provider with the given phone number already exists");
        }
        else{
            try{
                password=bcrypt.hashSync(plainPassword,saltRounds);
                const user = new professional({name,email,phone,serviceName});
                user.save();
                const userLogin = new login({phone,email,password,user_name,user_type});
                userLogin.save();
                response.json("Registration Successful");
                console.log("registration success");
            }
            catch(err){
                return response.send(err.message);
            }
        }
    })
};
exports.forgotPassword=function(request,response){
    var post_data=request.body;
    var email=post_data.email;
    login.findOne({"email":email},function(err,user){
        if(err || !user){
            return response.send("User with this E-mail does not exist");
            
        }
        //console.log(user.email);
        const token=jwt.sign({_id:user._id},RESET_PASSWORD_KEY,{expiresIn:'30m'});
        let link = CLIENT_URL + "/reset-password/" + token;
        const data={
            to: user.email,
            from: 'patel.pooja574@gmail.com',
            subject: 'Account Password Reset',
            html: `
                    <p>Hi,</p>
                    <p>You are receiving this because you have requested the reset of the password for your account.
                    Please click on the following ${link} to reset your password.</p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    `
        }
        return user.updateOne({resetPasswordLink:token},function(err,success){
            if(err){
                return response.send("Reset password link error. Please try again later.");
            }
            else{
                sgMail.send(data, (error, result) => {
                    if (error){
                        return response.send("message:"+error.message);
                    } 
                    response.send("message: A reset email has been sent to " + user.email + '.');
                });
            }
        });
    });
};

exports.resetPassword=function(request,response){
    var post_data=request.body;
    var resetLink=post_data.resetLink;
    var plainPassword=post_data.newPassword;
    if(resetLink){
        jwt.verify(resetLink,RESET_PASSWORD_KEY,function(error,link){
            if(error){
                return response.send("message:"+error.message);
            }
            login.findOne({'resetPasswordLink':resetLink},function(error,user){
                if(error || !user){
                    return response.send("User with this token does not exist");    
                }
                newPassword=bcrypt.hashSync(plainPassword,saltRounds);
                user.updateOne({'password':newPassword,'resetPasswordLink':''},function(error,success){
                    if (error){
                        return response.send("Reset password error!");
                    } 
                    else{
                        const data = {
                            to: user.email,
                            from: 'patel.pooja574@gmail.com',
                            subject: "Your password has been changed",
                            html: `<p>Hi,</p> 
                                   <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
                                   `
                        };
        
                        sgMail.send(data, (error, result) => {
                            if (error){
                                return response.send('message:'+error.message);
                            }
                            response.send('Your password has been updated.');
                        });
                        //response.send('Your password has been changed');
                    }
                });
            });
        });
    }
    else{
        return response.send("Authentication error,please try again later.");
    }

};

exports.googleSignup=function(req,res){
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
        });
        console.log(url)
        res.redirect(url);
    } else {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        gmail.users.labels.list({
            userId: 'me',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const labels = res.data.labels;
            if (labels.length) {
                console.log('Labels:');
                labels.forEach((label) => {
                    console.log(`- ${label.name}`);
                });
            } else {
                console.log('No labels found.');
            }
        });
        res.send('Logged in')
    }
};


exports.googleAuth=function(request,response){
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
                //res.redirect('/')
            }
        });
    }
};


/*exports.sendOtp=function(request,response){
    var post_data=request.body;
    var number=post_data.number;
    mb.verify.create(number,{
        template: "Your verification code is %token"
    },function(error,response){
        if(error){
            return response.send("Invalid number."+error.message);
        }
        else{
            login.findOne({'phone':number},function(error,user){
                if(error){
                    return response.send("User does not exist with given number");
                }
                response.send("verifaction code has been sent to given mobile number.")
            });
            
        }
    }
    )
};*/