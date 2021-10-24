/**
|----------------------------------------------
| Login Controller
|----------------------------------------------
| Holds all of the
| Student login.
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../database/models/student');
const formvalidator = require('../middlewares/formvalidator');

require('dotenv').config();
var secret = process.env.SECRET;

class LoginController{
	/**
	* Student login
	*/
	static loginStudent(req, res){
		try{

			let{email, password} = req.body;
			// validate entry
		    let rules = {
		    	email:'required',
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

			Student.findAll({
				where: {email: email}
			}).then(async user=>{
				if (user.length == 0) {
		 			res.status(200).json({error:true,message: "Invalid Credentials."})
		 		}else{

		 			let passwordIsValid = bcrypt.compareSync(password, user[0].dataValues.password.trim());
			  		if (passwordIsValid){

						let studentDetails = {
							id:user[0].dataValues.id,
							first_name:user[0].dataValues.first_name,
							last_name:user[0].dataValues.last_name,
							gender:user[0].dataValues.gender,
							age:user[0].dataValues.dob,
							email:user[0].dataValues.email,
							username:user[0].dataValues.username,
						};

						let token = jwt.sign({
				          user: studentDetails
				        }, secret, {});
						studentDetails.token = token;
				        return res.status(200).json({
							user: studentDetails,
				        	status:"SUCCESS",
				        	message:"Login Successful."
				        });
					}else{
						return res.status(200).json({
				          status: "FAILED",
				          message: 'Login Failed.'
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

}

module.exports = LoginController;