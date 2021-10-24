/**
|----------------------------------------------
| Enrollment Controller
|----------------------------------------------
| Holds all user operations
|----------------------------------------------
*/
const callbacks = require('../function/index.js');
const Enrollment = require('../database/models/').Enrollment;
const moment = require('moment');
const Course = require('../database/models/').Course;
const formvalidator = require('../middlewares/formvalidator');

require('dotenv').config();


class EnrollmentController{

	/**
	* student enroll course
	*/
	static async enrollCourse(req, res){
		try{
			let student_id = req.decoded.user.id;

			let {course_id} = req.body;
			let rules = {course_id:'required'}
			let validator = formvalidator(req, rules);

			if(validator){
				return res.status(203).json({
					error:true,
					message:validator
				});
			}

			let validateCourse = await callbacks.multiple(Course, {id: course_id});
			if (validateCourse.length < 1) {
				return res.status(200).json({
					error: true,
					message: 'Invalid Course Specified'
				});
			}

			let enrollCourse = {
				student_id: student_id,
				course_id: course_id
			}

			Enrollment.create(enrollCourse)
				.then(async (enrolled)=>{
					if(enrolled){
						return res.status(200).json({
							status:"SUCCESS",
							message:"Enrollment Successful."
						});
					}else{
						return res.status(200).json({
							error:true,
							message:"Failed to Enroll Course."
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
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * list student enrolled course
	 */
	static async courseList(req, res){
		try{
			let student_id = req.decoded.user.id;

			Enrollment.findAll({
				include:[
					{
						model:Course
					},
			],
				where: {student_id: student_id}

			}).then(async (courses)=>{
				if(courses){
					let data = [];
					courses.forEach((item)=>{
						let createdAt = moment(item.createdAt).format('DD/MM/YYYY');
							var obj = {
								student_id:item.student_id,
								course_name:item.Course.course_name,
								registration_date:createdAt.toUpperCase()
							}

						data.push(obj);
					});
					return res.status(200).json({
						enrollments: data,
						status:"SUCCESS",
						message:`You have ${courses.length} enrollments`
					});
				}else{
					return res.status(200).json({
						error:true,
						message:"Failed to Enroll Course."
					});
				}
			}).catch(err=>{
					return res.status(200).json({
						error:true,
						message:err.message
					});
				});


		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	 * delete course enrolled
	 */
	static async deleteEnrolledCourse(req, res){
		try{
			console.log('I am here- 1');
			// validate access
			let student_id =  req.decoded.user.id;
				// collect data
				let course_id = req.params.course_id;
				console.log('I am here- 1');
				// validate course id
				let checkId = await callbacks.multiple(Course, {id:course_id});

				if(checkId.length < 1){
					return res.status(203).json({
						error:true,
						message: 'Invalid Course Supplied.'
					});
				}

			console.log('I am here- 2');

				// delete organization record
				Enrollment.destroy({
					where:{
						course_id:course_id,
						student_id: student_id
					}
				}).then(async deleted=>{
					if(deleted){
						return res.status(200).json({
							error:false,
							message:"Course Enrolled deleted successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Failed to delete Enrolled Course."
						});
					}
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}


}

module.exports = EnrollmentController;