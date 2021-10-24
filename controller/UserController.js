/**
|----------------------------------------------
| User Controller
|----------------------------------------------
| Holds all user operations
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const UserType = require('../database/models/').UserType;
const User = require('../database/models/').User;
const moment = require('moment');
const ScheduleCounselling = require('../database/models/').ScheduleCounselling;
const Pledge = require('../database/models/').Pledge;
const CounselFeedback = require('../database/models/').CounselFeedback;
const formvalidator = require('../middlewares/formvalidator');
const {cloudinary} = require('../middlewares/cloudinary');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

require('dotenv').config();
var secret = process.env.SECRET;


class UserController{

	/**
	* get user profile
	*/
	static async getUserProfile(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'member' || auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				
				// fetch all user profile
			    User.findAll({
			    	where:{
			    		id:req.decoded.user.id
			    	}
			    })
			    .then(record=>{
			    	return res.status(200).json({data:record});
			    })
			    .catch(err=>{
			    	return res.status(203).json({
			    		error:true,
			    		message:err.message
			    	});
			    });
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* update basic profile
	*/
	static async updateBasicProfile(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'member' || auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let user_id = req.decoded.user.id;
				let dob = req.decoded.user.dob;
				let image_url = req.decoded.user.image_url;

				let {title, first_name, last_name, phone, email, gender, marital_status, lga_id, address } = req.body;
				// validate entry
			    let rules = {
			    	'title':'required',
			    	'first_name':'required',
			    	'last_name':'required',
			    	'email':'required|email',
			    	'phone':'required',
					'gender':'required',
					'marital_status':'required',
					'lga_id':'required',
					'address':'required',
			    };

			    let validator = formvalidator(req, rules);
				
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate email 
				let validateEmail = await callbacks.multiple(User, {email:email});

				if(validateEmail.length > 0 && validateEmail[0].dataValues.id != user_id){
					return res.status(203).json({
						error:true,
						message:"Email already exist."
					});
				}

				// validate phone number
				let validatePhone = await callbacks.multiple(User, {phone:phone});

				if(validatePhone.length > 0 && validatePhone[0].dataValues.id != user_id){
					return res.status(203).json({
						error:true,
						message:"Phone number already exist."
					});
				}

			    // update user account
			    let userAccount = {
					title: title,
			    	first_name:first_name,
			    	last_name:last_name,
			    	email:email,
			    	phone:phone,
					gender: gender,
					marital_status: marital_status,
					lga_id: lga_id,
					address: address
			    }

			    User.update(userAccount, {
			    	where:{
			    		id:user_id
			    	}
			    }).then(result=>{
			    	if(result){
		    			let userDetails  = {
    						id:user_id,
							title: title,
	  						first_name:first_name,
	  						last_name:last_name,
	  						email:email,
	  						phone:phone,
							gender: gender,
							marital_status: marital_status,
							lga_id: lga_id,
							address: address
    					}

    					let userData = {
							title: title,
    						first_name:first_name,
	  						last_name:last_name,
	  						fullname:first_name+' '+last_name,
	  						email:email,
	  						phone:phone,
							gender: gender,
							marital_status: marital_status,
							lga_id: lga_id,
							dob:dob,
							image_url:image_url,
							address: address,
							is_auth: auth
    					};
						//
						// var token = jwt.sign({
						// 	user: userDetails
						// }, secret, {});
						//
						// userData.token = token;
    					return res.status(200).json({
    						error:false,
    						data:userData,
    						message:"Profile updated successfully."
    					});
			    	}else{
			    		return res.status(203).json({
			    			error:true,
			    			message:'Failed to update profile.'
			    		});
			    	}
			    })
			    .catch(err=>{
			    	return res.status(203).json({
			    		error:true,
			    		message:'Profile update failed.'
			    	});
			    });
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(500).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * update user device token
	 */
	static async updateDeviceToken(req, res){
		try{
			// validate user
			let auth = req.decoded.user.is_auth;

			if(auth == 'admin' || auth == 'pastor' || auth == 'deaconate' || auth == 'member'){
				// collect data
				let { device_token } = req.body;

				// validate entry
				let rules = {
					'device_token':'required'
				};

				let validator = formvalidator(req, rules);

				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}
				User.update({
						device_token:device_token
					},{
						where:{
							id:req.decoded.user.id
						}
					}).then(updated=>{
						if(updated){
							return res.status(200).json({
								error:false,
								message:"Token updated successfully."
							});
						}else{
							return res.status(203).json({
								error:true,
								message:"Failed to update device token."
							});
						}
					}).catch(err=>{
						return res.status(203).json({
							error:true,
							message:err.message
						});
					});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* change password
	*/
	static async changePassword(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'member' || auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let user_id = req.decoded.user.id;
				let {old_password, new_password} = req.body;

				User.findAll({
		          where: {
		            id: user_id
		          }
		        }).then(response => {
					// verify password
					var verifyPassword = bcrypt.compareSync(old_password.trim(), response[0].password);

					if (verifyPassword) {
						// encrypt password
						var encryptPassword = bcrypt.hashSync(new_password, 10);

						// update password
						User.update({ password: encryptPassword }, {
						  where: {
						    id: user_id
						  }
						}).then(updated => {
						  if (updated) {
						  	let vPassword = {
						  		password:encryptPassword
							}
						    res.status(200).json({ error: false, message: "Password updated successfully." });
						  } else {
						    res.status(203).json({ error: true, message: "Password update failed." })
						  }
						}).catch(err => {
						  return res.status(203).json({
						  	error:true,
						  	message:err.message
						  });
						});
					} else {
						return res.status(203).json({error:true, message: "Invalid old password supplied." });
					}
		        }).catch(err => {
		          return res.status(203).json({
		          	error:true,
		          	message:"Failed to change password."+err.message
		          });
		        });
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.sendStatus(500);
		}
	}


	/**
	* update user profile image
	*/
	static async updateProfileImage(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'member' || auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				var image_url = req.file.secure_url;
				var image_key = req.file.public_id;

				// check if user already has a picture
				let checkUserImage = await callbacks.findOne(User, {id:req.decoded.user.id});
				console.log(checkUserImage.dataValues);
				if(checkUserImage.image_url != null){
					// get previous key and delete key
					await cloudinary.uploader.destroy(checkUserImage.image_key);
				}

				var imageData = {
					image_url: image_url,
					image_key: image_key
				}
				// update new image url
				User.update({
					image_url,
					image_key
				},{
					where:{
						id:req.decoded.user.id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							data: imageData,
							message:"profile picture updated successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Failed to update user profile picture"
						});
					}
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			console.log(e);
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * Schedule Counselling
	 */
	static async scheduleCounselling(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'deaconate' || auth == 'member' || auth == 'admin'){
				let user_id = req.decoded.user.id;
				// collect data
				let {message} = req.body;

				// validate entry
				let rules = {
					message:'required'
				}
				let validator = formvalidator(req, rules);
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}
				// upload counselling request
				let counselObj = {
					message:message,
					user_id:user_id,
					status: 'Pending'
				}

				ScheduleCounselling.create(counselObj)
					.then(async saved=>{
						if(saved){
							return res.status(201).json({
								error:false,
								message:'Counselling Request sent successfully.',
								data:saved
							});

						}else{
							return res.status(203).json({
								error:true,
								message:'Failed to deliver counselling request.'
							});
						}
					})
					.catch(err=>{
						return res.status(203).json({
							error:true,
							message:err.message
						});
					});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * fetch Member Counsellings
	 */
	static async fetchCounsellingRequests(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'deaconate' || auth == 'member' || auth == 'admin'){
				let user_id = req.decoded.user.id;

				ScheduleCounselling.findAll({
					where: {user_id: user_id},
					include: [{
						model: CounselFeedback,
						include: [User]
					}],
				}).then(counsels=>{
					// collect data
					let data = [];
					for (var i = 0; i < counsels.length; i++) {
						data.push(counsels[i].dataValues);
					}
					// return record
					return res.status(200).json({data});
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * User create Plegdge
	 */
	static async initiatePledge(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'deaconate' || auth == 'member' || auth == 'admin' || auth == 'pastor'){
				let user_id = req.decoded.user.id;
				// collect data
				let {title, deadline_date, deadline_time} = req.body;

				// validate entry
				let rules = {
					title:'required',
					deadline_date:'required',
					deadline_time:'required'
				}
				let validator = formvalidator(req, rules);
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}
				// upload pledge
				let pledgeObj = {
					title:title,
					user_id:user_id,
					deadline_date:deadline_date,
					deadline_time:deadline_time,
					status: 'Pending'
				}

				Pledge.create(pledgeObj)
					.then(async saved=>{
						if(saved){
							return res.status(201).json({
								error:false,
								message:'Pledge saved successfully.',
								data:saved
							});

						}else{
							return res.status(203).json({
								error:true,
								message:'Failed to save Pledge.'
							});
						}
					})
					.catch(err=>{
						return res.status(203).json({
							error:true,
							message:err.message
						});
					});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * fetch All Pledges
	 */
	static async fetchAllPledges(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'deaconate' || auth == 'member' || auth == 'admin' || auth == 'pastor'){
				let user_id = req.decoded.user.id;
				Pledge.findAll({
					where: {user_id: user_id}
				}).then(pledge=>{
					// collect data
					let data = [];
					for (var i = 0; i < pledge.length; i++) {
						data.push(pledge[i].dataValues);
					}
					// return record
					return res.status(200).json({data});
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * Update Pledge
	 */
	static async updatePledge(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin' || auth == 'member'){
				// collect data
				let {pledge_id} = req.body;
				let {status} = 'Approved';

				Pledge.update({
					status:status
				},{
					where:{
						id:pledge_id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"Pledge successfully updated."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Failed to update pledge."
						})
					}
				}).catch(err=>{
					return res.status(203).json({error:true, message:err.message});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * view all Ministers
	 */
	static async fetchAllMinisters(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin' || auth == 'member'){
				// get user type id
				let getUserType = await callbacks.findOne(UserType, {user_type:'deaconate'});
				if(getUserType.length < 1){
					return res.status(203).json({
						error:true,
						message:'Failed to fetch records'
					});
				}
				let getUserType2 = await callbacks.findOne(UserType, {user_type:'pastor'});
				if(getUserType2.length < 1){
					return res.status(203).json({
						error:true,
						message:'Failed to fetch records'
					});
				}
				User.findAll({
					where:{
						user_type_id:{
							[Op.or]: [getUserType.id, getUserType2.id],
						}
					}
				}).then(users=>{
					// collect data
					let data = [];
					for (var i = 0; i < users.length; i++) {
						data.push(users[i].dataValues);
					}
					// return record
					return res.status(200).json({data});
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * view all council
	 */
	static async fetchAllCouncils(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin' || auth == 'member'){
				// get user type id
				let getUserType2 = await callbacks.findOne(UserType, {user_type:'council'});
				if(getUserType2.length < 1){
					return res.status(203).json({
						error:true,
						message:'Failed to fetch records'
					});
				}
				User.findAll({
					where: {
						user_type_id: getUserType2.id
					}
				}).then(users=>{
					// collect data
					let data = [];
					for (var i = 0; i < users.length; i++) {
						data.push(users[i].dataValues);
					}
					// return record
					return res.status(200).json({data});
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * view all members
	 */
	static async fetchAllMembers(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin' || auth == 'member'){
				// get user type id
				let getUserType = await callbacks.findOne(UserType, {user_type:'member'});

				if(getUserType.length < 1){
					return res.status(203).json({
						error:true,
						message:'Failed to fetch records'
					});
				}

				User.findAll({
					where:{
						user_type_id:getUserType.id
					}
				}).then(users=>{
					// collect data
					let data = [];
					for (var i = 0; i < users.length; i++) {
						data.push(users[i].dataValues);
					}
					// return record
					return res.status(200).json(data);
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}


	/**
	 * view all Important VIPs
	 */
	static async fetchAllVIPDates(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin' || auth == 'member') {
				var dateobj= new Date() ;
				var current_month = dateobj.getMonth() + 1;
				User.findAll({
					where: {
						month: current_month
					}
				}).then(users => {
					// collect data
					let data = [];
					for (var i = 0; i < users.length; i++) {
						data.push(users[i].dataValues);
					}
					// return record
					return res.status(200).json({data});
				}).catch(err => {
					return res.status(203).json({
						error: true,
						message: err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}
}

module.exports = UserController;