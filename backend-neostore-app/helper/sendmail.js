const nodemailer = require("nodemailer");
const cred = require('../env')

module.exports=function sendmail(otp,remail){

    let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: cred.email,
        pass: cred.password
    }
    });

    let mailDetails = {
    from: cred.email,
    to: `${remail}`,
    subject: 'OTP to Reset Password',
    text: `${otp}`
    };

    mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
    });
}