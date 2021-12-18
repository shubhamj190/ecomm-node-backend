const nodemailer = require("nodemailer");

const sendMail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  const message = {
    from: 'shubham@dev.com', // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
    // html: "<b>Hello world?</b>", // html body
  }

  // send mail with defined transport object
  await transporter.sendMail(message);
};

module.exports = sendMail;
