/**
|----------------------------------------------
| Login Controller
|----------------------------------------------
| Holds all of the
| user login.
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const Mailer = require('../middlewares/mail.js');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const UserType = require('../database/models/').UserType;
const User = require('../database/models/').User;
const formvalidator = require('../middlewares/formvalidator');
const Sequelize = require('sequelize');

require('dotenv').config();
var secret = process.env.SECRET;

class LoginController{
	/**
	* User login
	*/
	static loginUser(req, res){
		try{

			var phone = req.body.phone;
			var password = req.body.password;

			// validate entry
		    let rules = {
		    	phone:'required',
		    	password:'required'
		    }

		    let validator = formvalidator(req, rules);
			
			if(validator){
				return res.status(203).json({
					error:true,
					message:validator
				});
			}
			password = password.replace(/\s/g,'');

			User.findAll({
				where: {phone: phone}
			}).then(async user=>{
				if (user.length == 0) {
		 			res.status(200).json({error:true,message: "Invalid Credentials."})
		 		}else{

		 			var passwordIsValid = bcrypt.compareSync(password, user[0].dataValues.password.trim());
	  		
			  		if (passwordIsValid){

			  			// validate user status
			  			if(user[0].dataValues.status == 'Suspended'){
			  				return res.status(203).json({
			  					error:true,
			  					message:"Your account has been suspended. Contact support."
			  				});
			  			}

			  			// get user type id
			  			let userTypeId = user[0].dataValues.user_type_id;
			  			let userType = await callbacks.multiple(UserType, {id:userTypeId});

			  			let userDetails = '';
			  			let userData = '';

						userDetails = {
							id:user[0].dataValues.id,
							image_url:user[0].dataValues.image_url,
							title: user[0].dataValues.title,
							first_name:user[0].dataValues.first_name,
							last_name:user[0].dataValues.last_name,
							email:user[0].dataValues.email,
							phone:user[0].dataValues.phone,
							marital_status:user[0].dataValues.marital_status,
							address:user[0].dataValues.address,
							is_auth: userType[0].dataValues.user_type
						};

						userData = {
							id:user[0].dataValues.id,
							image_url:user[0].dataValues.image_url,
							title: user[0].dataValues.title,
							first_name:user[0].dataValues.first_name,
							last_name:user[0].dataValues.last_name,
							email:user[0].dataValues.email,
							phone:user[0].dataValues.phone,
							year: user[0].dataValues.year,
							dob: user[0].dataValues.dob,
							marital_status:user[0].dataValues.marital_status,
							address:user[0].dataValues.address,
							is_auth: userType[0].dataValues.user_type
						};

						var token = jwt.sign({
				          user: userDetails
				        }, secret, {});
						userData.token = token;
				        return res.status(200).json({
				        	error:false,
				        	account:userType[0].dataValues.user_type,
							data: userData
				        });
					}else{
						return res.status(200).json({
				          error: true,
				          message: 'Invalid Credentials.'
				        });
					}
		 		}
			}).catch(e=>{
				return res.status(200).json({
					error:true,
					message:e.message
				});
			});
		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* forgot password
	*/
	static async forgotPassword (req, res){
		try{

			// collect email address
			var email = req.body.email;
			let rules  = {
				'email':'required'
			}

			let validator = formvalidator(req, rules);

			if(validator){
				return res.status(203).json({
					error:true,
					data:{},
					message:validator
				});
			}

			// validate if email exists
			var validateEmail = await callbacks.validateEmail(User, email);

			if(validateEmail.length < 1){
				return res.status(203).json({error:true, data:{}, message:"Invalid Email Supplied"});
			}

			// reset password
			var newPassword = await callbacks.randomStr(6);
			var hashedPassword = bcrypt.hashSync(newPassword, 10);

			// send mail
			var resetPassword = await Mailer.resetPasswordMail(email, validateEmail[0].dataValues.first_name+" "+validateEmail[0].last_name, newPassword);

			if(resetPassword != undefined){
				// update password
				User.update({password:hashedPassword.trim()},{
					where:{
						email:email
					}
				}).then(result=>{
					if(result){

						return res.status(200).json({error:false, data:{}, message: "Password Reset Successful. Kindly check your email for new Password"});
					}else{	
						// return error message
						return res.status(203).json({error:true, data:{}, message:"Sorry, unable to reset password."});
					}
					return
				}).catch(err=>{
					// return error message
					return res.status(203).json({error:true, data:{}, message:"Sorry, unable to reset password."});
				});
			}else{
				// return error message
				return res.status(203).json({error:true, data:{}, message:"Sorry, unable to reset password."});
			}
		}catch(e){
			console.log(e);
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}
}

module.exports = LoginController;