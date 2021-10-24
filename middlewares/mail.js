require('dotenv').config();
const template = require('./email_template/');
const callbacks = require('../function/index.js');
const secret = process.env.SECRET;

const sgMail = require('@sendgrid/mail');
// set api key
sgMail.setApiKey(process.env.MAIL_ENCRYPTION);


/**
* mail class
*/
class Mailer{
	/**
	 * send OTP
	 */
	static async sendOTPMail(email, otp){
		let currentYear = await callbacks.currentYear();

		// send mail
		const msg = {
			to: email,
			from: process.env.MAIL_USERNAME,
			subject: 'Account Verification OTP',
			html: template.verifyOTP(otp, currentYear)
		}

		return sgMail.send(msg);
	}
}

module.exports = Mailer;