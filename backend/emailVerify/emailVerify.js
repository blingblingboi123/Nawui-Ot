import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const verifyLink = `${process.env.FRONTEND_URL}/verify/${token}`;

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",

    html: `
      <h2>Email Verification</h2>

      <p>Please click the button below to verify your email:</p>

      <a href="${verifyLink}">
        Verify Email
      </a>
    `,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {

    if (error) {
      console.log("Email Error:", error);
      return;
    }

    console.log("Email Sent Successfully");
    console.log(info.response);
  });
};