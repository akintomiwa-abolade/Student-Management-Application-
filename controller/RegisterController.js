/**
|----------------------------------------------
| Login Controller
|----------------------------------------------
| Holds all of the
| user login.
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const UserType = require('../database/models/').UserType;
const User = require('../database/models/').User;
const formvalidator = require('../middlewares/formvalidator');
const Sequelize = require('sequelize');
const request = require('request');
require('dotenv').config();

class RegisterController {
	/**
	 * Student Registration
	 */
	static async registerUser(req, res) {
		try {
			let {first_name, last_name, email, username, password, dob, gender} = req.body;

			// validate entry
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
			let validateEmail = await callbacks.multiple(User, {email: email});
			if (validateEmail.length > 0) {
				return res.status(200).json({
					error: true,
					message: 'Email already exist.'
				});
			}

			// create user
			let createUser = {
				title:title,
				first_name: first_name,
				last_name: last_name,
				email: email,
				phone: phone,
				password: bcrypt.hashSync(password, 10),
				dob: dob,
				year: year,
				month: month,
				day: day,
				user_type_id: userType[0].dataValues.id
			}

			// create
			User.create(createUser)
				.then(async (saved) => {
					if (saved) {
						return res.status(201).json({
							error: false,
							message: "Registration successful"
						});
					} else {
						return res.status(203).json({
							error: true,
							message: "Failed to register. Kindly try again later."
						});
					}
				})
				.catch(err => {
					return res.status(200).json({
						error: true,
						message: "Failed to register. Kindly try again later."
					});
				});

		} catch (e) {
			return res.status(200).json({
				error: true,
				message: e.message
			});
		}
	}
}
module.exports = RegisterController;