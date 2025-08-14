const nodemailer = require("nodemailer");

exports.sendEmail =
  (...options) =>
  async (req, res, next) => {
    //1 create a transporter

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS
      }
    });

    //2 define the email options
    const mailOptions = {
      from: "AZIZ <Bot@natours.io>",
      to: options.email,
      subject: options.subject,
      text: options.msg
    };
    //3Actually send the email

    await transporter.sendMail(mailOptions);
  };
