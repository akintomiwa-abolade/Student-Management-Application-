/**
|----------------------------------------------
| Registration Controller
|----------------------------------------------
| Holds all of the
| registration processes.
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const Student = require('../database/models/student');
const formvalidator = require('../middlewares/formvalidator');
require('dotenv').config();

class RegisterController {
	/**
	 * Student Registration
	 */
	static async registerStudent(req, res) {
		try {
			let {first_name, last_name, email, username, password, dob, gender} = req.body;

			// validate entries
			let rules = {
				first_name: 'required',
				last_name: 'required',
				email: 'required|email',
				password: 'required',
				dob: 'required'
			}

			let validator = formvalidator(req, rules);
			if (validator) {
				return res.status(203).json({
					error: true,
					message: validator
				});
			}
			password = password.replace(/\s/g, '');
			// validate email
			let validateEmail = await callbacks.multiple(Student, {email: email});
			if (validateEmail.length > 0) {
				return res.status(200).json({
					error: true,
					message: 'Email already exist.'
				});
			}

			let validateUsername = await callbacks.multiple(Student, {username: username});
			if (validateUsername.length > 0) {
				return res.status(200).json({
					error: true,
					message: 'Username already exist.'
				});
			}

			let otp = await callbacks.randomNum(5);

			// create Student
			let createStudent = {
				first_name: first_name,
				last_name: last_name,
				email: email,
				username: username,
				password: bcrypt.hashSync(password, 10),
				dob: dob,
				gender:gender,
				otp:otp
			}

			// send mail
			var mailOTP = await Mailer.sendOTPMail(email, otp);
			if(mailOTP != undefined) {
				Student.create(createStudent)
					.then(async (saved) => {
						if (saved) {
							return res.status(201).json({
								status: `SUCCESS`,
								message: `Verification token has been sent to ${email}`
							});
						} else {
							return res.status(203).json({
								status: "FAILED",
								message: "Registration failed",
							});
						}
					})
					.catch(err => {
						return res.status(200).json({
							error: true,
							message: "Failed to register. Kindly try again later."
						});
					});
			}

		} catch (e) {
			return res.status(200).json({
				error: true,
				message: e.message
			});
		}
	}

	/**
	 * verify otp
	 */
	static async verifyUserOTP(req, res){
		try{
			// collect data
			let {email, otp} = req.body;

			// validate entry
			let rules = {
				'email':'required',
				'otp':'required'
			};

			let validator = formvalidator(req, rules);

			if(validator){
				return res.status(203).json({
					error:true,
					message:validator
				});
			}

			// check for otp
			let validateOTP = await callbacks.multiple(Student, {email:email, otp:otp});

			if(validateOTP.length < 1){
				return res.status(200).json({
					error:true,
					message:"Invalid otp supplied."
				});
			}

			// update student status
			let updateStatus = {otp:null}

			Student.update(updateStatus, {
				where:{
					id:validateOTP[0].dataValues.id
				}
			}).then(async (updated)=>{
				if(updated){
					return res.status(200).json({
						status:"SUCCESS",
						message:"Registration Successful"
					});
				}else{
					return res.status(200).json({
						error:true,
						message:"Failed to validate OTP."
					});
				}
			})
				.catch(err=>{
					return res.status(200).json({
						error:true,
						message:err.message
					});
				});

		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}



}
module.exports = RegisterController;