/**
|----------------------------------
| Student Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const RegisterController = require('../../controller/RegisterController')
const LoginController = require('../../controller/LoginController');
const EnrollmentController = require('../../controller/EnrollmentController');
const authGuard = require('../../middlewares/authguard');


/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     tags:
 *       - Student Registration
 *     name: student register
 *     summary: Register student
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             username:
 *               type: string
 *             password:
 *               type: string
 *             dob:
 *               type: string
 *             gender:
 *               type: string
 *         required:
 *           - first_name
 *           - last_name
 *           - email
 *           - dob
 *           - password
 *     responses:
 *       '201':
 *         description: Verification token has been sent to your email
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// register student
router.post('/register', RegisterController.registerStudent);

/**
 * @swagger
 * /api/v1/verify/otp:
 *   post:
 *     tags:
 *       - Verify Student Email
 *     name: student OTP {email} verification
 *     summary: Verify student otp
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             otp:
 *               type: string
 *         required:
 *           - email
 *           - otp
 *     responses:
 *       '200':
 *         description: Student OTP verification successful
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// verify otp
router.post('/verify/otp', RegisterController.verifyUserOTP);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags:
 *       - Login
 *     name: student login Place
 *     summary: Login student
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: Login successful
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// login student
router.post('/login', LoginController.loginStudent);

/**
 * @swagger
 * /api/v1/enroll/course:
 *   post:
 *     tags:
 *       - Student Enroll course
 *     name: student enroll course
 *     summary: Enroll Student course
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             course_id:
 *               type: integer
 *         required:
 *           - course_id
 *     responses:
 *       '200':
 *         description: Course Successfully Enrolled
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// enroll course
router.post('/enroll/course', authGuard, EnrollmentController.enrollCourse);

/**
 * @swagger
 * /api/v1/student/course/enrolled:
 *   get:
 *     tags:
 *       - List of Enrolled Courses
 *     name: Fetch all courses enrolled by student request details
 *     summary: List all enrolled courses
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: delivery request object
 *       500:
 *         description: Internal server error
 */
// get all enrolled courses
router.get('/student/course/enrolled', authGuard, EnrollmentController.courseList);

/**
 * @swagger
 * /api/v1/delete/course/{course_id}:
 *   delete:
 *     tags:
 *       - Student Delete Enrolled Course
 *     name: delete enrolled course
 *     summary: delete only selected course
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         course_id: course_id
 *         schema:
 *           type: integer
 *         required:
 *           - course_id
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       203:
 *         description: Failed to delete course record
 *       500:
 *         description: Internal server error
 */
// delete enrolled course
router.delete('/delete/course/:course_id', authGuard, EnrollmentController.deleteEnrolledCourse);

module.exports = router;