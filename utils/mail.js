const nodemailer = require("nodemailer");
const {
    MoleculerError
} = require("moleculer").Errors;
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// Taken from https://raw.githubusercontent.com/ColorlibHQ/email-templates/master/10/index.html
const emailTemplate = fs.readFileSync(path.join(__dirname, './../templates/index.html'))
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NO_REPLY_EMAIL,
        pass: process.env.NO_REPLY_EMAIL_PASS,
    },
});

exports.sendUnreadMessagesToEmail = async (to, subject, content = []) => {
    if (!to) {
        throw new MoleculerError(
            "Email not provided!",
            404,
            "EMAIL_NOT_FOUND", {
                to,
            }
        );
    }

    const emailTemplateCompiled = _.template(emailTemplate);
    const emailContent = emailTemplateCompiled({
        content: content.join('<br >')
    });

    const message = {
        to,
        from: process.env.NO_REPLY_EMAIL,
        subject: subject,
        text: content.join('\n'),
        html: emailContent
    };

    try {
        await transporter.sendMail(message)
    } catch (err) {
        console.log('Email sending error ', JSON.stringify(err));
    }
}

exports.sendResetLinkToEmail = async (to, subject, html) => {
    if (!to) {
        throw new MoleculerError(
            "Email not provided!",
            404,
            "EMAIL_NOT_FOUND", {
                to,
            }
        );
    }

    await transporter.sendMail({
        to,
        from: process.env.NO_REPLY_EMAIL,
        subject,
        html
    }, (err, info) => {
        if (err) {
            console.log("Error occurred. " + err?.message);
        }

        console.log("Message sent: %s", info?.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}