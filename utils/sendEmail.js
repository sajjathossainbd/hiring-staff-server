const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `${options.recruiterName} <${options.recruiterEmail}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
