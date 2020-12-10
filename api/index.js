const _ = require('lodash');
const { DEBUG = false } = process.env;

const clog = require('color-logs')(true, DEBUG === 'true', __filename);

const Student = require('../lib/student');
const StudentRepository = require('../lib/student/studentRepository');
const Teacher = require('../lib/teacher');
const TeacherRepository = require('../lib/teacher/teacherRepository');

const Controller = {};
const fnList = [
  {
    name: 'registerStudents',
    disabled: false,
    fn: async (req, res) => {
      const status = { message: 'Something went wrong' }
      let statusCode = 500;

      const { teacher = '', students = [] } = req.body;
      clog.log(`Register ${students.length} student(s) under teacher ${teacher}`);

      try {
        // TODO: Validate if email is correct - use Util.isValidEmail(email)
        // Verify if the teacher exists
        const valid = await new Teacher(new TeacherRepository()).exists(teacher);
        if (!valid) {
          status.message = `Teacher ${teacher} is not a registered personnel in this school`;
          status.error = 'NOT_FOUND_TEACHER';
          statusCode = 404;
        } else {
          const { error = null, result } = await new Student(new StudentRepository())
            .register({
              teacher,
              students,
            });
          if (!error) {
            status.message = result === 0 ? `Students are already registered under ${teacher}` 
             : `Successfully registered ${result} student(s) under ${teacher}`;
            statusCode = result === 0 ? 409 : 204;  
          } else {
            status.error = error;
          }
        }
      } catch (err) {
        clog.debug(err);
        clog.error(err.toString());
        status.error = 'Hmmm... Something is not right. Contact us at help@govschool.com';
      }

      return res.status(statusCode).json({
        ...status,
      });
    },
  },
  {
    name: 'suspendStudent',
    fn: async (req, res) => {
      const status = { message: 'Something went wrong' }
      let statusCode = 500;

      const { student = '' } = req.body;
      clog.log(`Suspend student ${student}`);

      try {
        const { error, result } = await new Student(new StudentRepository())
          .suspend(student);
        if (error) {
          status.message = error;
          status.error = 'SERVER_ERROR';
        } else {
          statusCode = 204;
          status.message = 'Successfully suspended student';
          if (result === -1) {
            statusCode = 404;
            status.message = `Students ${student} not found!`;
          } else if (result === 0) {
            status.message = `Student ${student} is already suspended`
          }
        }  
      } catch (err) {
        clog.debug(err);
        clog.error(err.toString());
        status.error = 'Hmmm... Something is not right. Contact us at help@govschool.com';
      }

      return res.status(statusCode).json({
        ...status,
      });
    },
  },
  {
    name: 'retrieveForNotification',
    fn: async (req, res) => {
      const status = { message: 'Something went wrong' };
      let statusCode = 500, customResponse = null;

      const { notification = '', teacher = '' } = req.body;
      clog.log(`Retrieving students for notification ${notification}`);

      // Extract tagged unverified students
      const students = notification.split(' ')
        .filter(str => _.countBy(str)['@'] === 2 && str.charAt(0) === '@')
        .map(email => email.substr(1));

      try {
        const repository = new StudentRepository();
        const { error, result: recipients } = await new Student(repository)
          .retrieveForNotification({
            students,
            teacher,
          });
        if (error) {
          status.message = error;
          status.error = 'SERVER_ERROR';
        } else {
          statusCode = 200;
          customResponse = {
            recipients,
          };
        }
      } catch (err) {
        clog.debug(err);
        clog.error(err.toString());
        status.error = 'Hmmm... Something is not right. Contact us at help@govschool.com';
      }

      return res.status(statusCode).json(customResponse ? customResponse : {
        ...status,
      });
    },
  },
  {
    name: 'listCommonStudents',
    fn: async (req, res) => {
      const status = { message: 'Something went wrong' };
      let statusCode = 500, customResponse = null;

      const { teacher } = req.query;
      let teachers = [];
      if (!Array.isArray(teacher)) {
        teachers.push(teacher);
      } else {
        teachers = teacher;
      }
      clog.log(`List registered student(s) under teacher(s) ${teachers}`);

      // TODO: Check validity of teachers

      try {
        const repository = new StudentRepository();
        const { error, result: students } = await new Student(repository)
          .listCommonStudents({
            teachers,
          });
        if (error) {
          status.message = error;
          status.error = 'SERVER_ERROR';
        } else {
          statusCode = 200;
          customResponse = {
            students,
          };
        }
      } catch (err) {
        clog.debug(err);
        clog.error(err.toString());
        status.error = 'Hmmm... Something is not right. Contact us at help@govschool.com';
      }

      return res.status(statusCode).json(customResponse ? customResponse : {
        ...status,
      });
    },
  },
];

fnList.forEach(({ name, fn, disabled }) => {
  if (!disabled) {
    const temp = (req, res) => {
      clog.debug(`${name}()`);
      return fn(req, res, name);
    };
    Controller[name] = temp;
  }
});

module.exports = Controller;