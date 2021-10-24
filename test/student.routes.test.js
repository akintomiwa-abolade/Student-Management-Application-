
const request = require('supertest');
const app = require('../test_server');
let rndNum = Math.floor(10000 + Math.random() * 900000);

describe('Student Routes Test', function(){
	it('should register new student', async () => {
	    const res = await request(app)
	      .post('/api/v1/register')
	      .send({
			first_name:'TestStudentFirstname' + rndNum,
			last_name:'TestStudentLastname' + rndNum,
	      	email: 'test'+rndNum+'@gmail.com',
			username:'TestStudentUsername' + rndNum,
	      	password:'123456',
			dob:'26',
			gender:'Male'
	      });

	    expect(res.statusCode).toEqual(201);

	    expect(res.body).toHaveProperty('first_name');
	});

	it('should login student', async () => {
	    const res = await request(app)
	      .post('/api/v1/login')
	      .send({ 
	      	email: `test${rndNum}@email.com`,
	      	password:'123456'
	      });

	    expect(res.statusCode).toEqual(200);
	    
	    expect(res.body).toHaveProperty('token');
	});

	it('should enroll course', async () => {
		const res = await request(app)
			.post('/api/v1//enroll/course')
			.send({
				student_id: '1',
				course_id: '1'
			});

		expect(res.statusCode).toEqual(200);
	});


	it('should fetch all student enrolled courses', async () => {
	    const res = await request(app).get('/api/v1/student/course/enrolled');
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

});