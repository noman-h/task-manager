const nodemailer=require('nodemailer')

const transport=nodemailer.createTransport({
     service:"gmail",
  auth:{
    user:process.env.usermail,
    pass:process.env.userpassword
  }
})

exports.mailsender=async (to,subject,html)=>{
  const result=await transport.sendMail({
    from:process.env.usermail,
    to:to,
    subject:subject,
    html:html
  })
  return result.messageId
}

exports.otpgen=()=>{
   const otp=Math.floor(1000+Math.random()*9000);
   return otp;
}