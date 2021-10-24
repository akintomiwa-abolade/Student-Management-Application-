/**
|----------------------------------------------
| Enrollment Controller
|----------------------------------------------
| Holds all user operations
|----------------------------------------------
*/
const callbacks = require('../function/index.js');
const Enrollment = require('../database/models/enrollment');
const moment = require('moment');
const Course = require('../database/models/course');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
				course_name: validateCourse[0].dataValues.course_name
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
				where: {student_id: student_id}
			}).then(async (courses)=>{
				if(courses){
					let data = [];
					for (let i = 0; i < courses.length; i++) {
						data[i].dataValues.registration_date = moment(courses[i].createdAt, "YYYY-MM-DD h:mm:ss:a").fromNow();
						data.push(courses[i].dataValues);
					}
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

}

module.exports = EnrollmentController;