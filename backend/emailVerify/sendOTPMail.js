import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendOTPEmail = (OTP, email) => {

    if (!email) {
        throw new Error("Email is required");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'OTP for Password Reset',
        html: `<p>Your OTP is: <strong>${OTP}</strong></p>`
    };

    console.log("Sending OTP to:", email);

    transporter.sendMail(mailConfigurations, (error, info) => {
        if (error) {
            console.log("Mail Error:", error);
            return;
        }
        console.log('OTP Sent Successfully');
    });
};