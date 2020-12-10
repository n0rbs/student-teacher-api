const sinon = require("sinon");
const faker = require("faker");
const { expect } = require('chai');

const Student = require('../lib/student');
const StudentRepository = require('../lib/student/studentRepository');

describe('Student', () => {
  describe('Register', () => {
    it('should register new students', async () => {
      const expectedResult = 2;
      const stubData = {
        teacher: 'teacherken@gmail.com',
        students:
          [
            faker.internet.email(),
            faker.internet.email(),
          ]
      };

      const studentRepo = new StudentRepository();
      const stub = sinon.stub(studentRepo, 'save').returns(expectedResult);

      const studentService = new Student(studentRepo);
      const { error, result } = await studentService.register(stubData);

      expect(stub.calledOnce).to.be.true;
      expect(error).to.equal(null);
      expect(result).to.equal(expectedResult);
    });
  });
  describe('List common students', async () => {
    it('should list common students', async () => {
      const expectedResult = [
        faker.internet.email(),
        faker.internet.email(),
      ];
      const stubData = {
        teachers: [
          'teacherken@gmail.com',
          'teacherjoe@gmail.com'
        ]
      };

      const studentRepo = new StudentRepository();
      const stub = sinon.stub(studentRepo, 'findAllCommon').returns(expectedResult);

      const studentService = new Student(studentRepo);
      const { error, result } = await studentService.listCommonStudents(stubData);

      expect(stub.calledOnce).to.be.true;
      expect(error).to.equal(null);
      expect(result.length).to.equal(expectedResult.length);
    });
  });
  describe('Suspend student', async () => {
    it('should suspend student', async () => {
      const expectedResult = {
        get: {
          dataValues: { email: faker.internet.email(), suspended: false },
        },
        update: [1],
      };
      const stubData = faker.internet.email();

      const studentRepo = new StudentRepository();
      const stubGet = sinon.stub(studentRepo, 'getStudent').returns(expectedResult.get);
      const stubUpdate = sinon.stub(studentRepo, 'updateStudent').returns(expectedResult.update);

      const studentService = new Student(studentRepo);
      const { error, result } = await studentService.suspend(stubData);

      expect(stubGet.calledOnce).to.be.true;
      expect(stubUpdate.calledOnce).to.be.true;
    });
    it('should not suspend student if already suspended', async () => {
      const expectedResult = {
        get: {
          dataValues: { email: faker.internet.email(), suspended: true },
        },
        update: null,
      };
      const stubData = faker.internet.email();

      const studentRepo = new StudentRepository();
      const stubGet = sinon.stub(studentRepo, 'getStudent').returns(expectedResult.get);
      const stubUpdate = sinon.stub(studentRepo, 'updateStudent').returns(expectedResult.update);

      const studentService = new Student(studentRepo);
      const { error, result } = await studentService.suspend(stubData);

      expect(stubGet.calledOnce).to.be.true;
      expect(result).to.equal(0);
    });
    it('should not suspend non-registered student', async () => {
      const expectedResult = {
        get: null,
      };
      const stubData = faker.internet.email();

      const studentRepo = new StudentRepository();
      const stubGet = sinon.stub(studentRepo, 'getStudent').returns(expectedResult.get);

      const studentService = new Student(studentRepo);
      const { error, result } = await studentService.suspend(stubData);

      expect(stubGet.calledOnce).to.be.true;
      expect(result).to.equal(-1);
    });
  });
  describe('Retrieve students for notification', async () => {
    it('should retrieve list of students', async () => {
      const expectedResult = [
        faker.internet.email(),
        faker.internet.email(),
      ];
      const stubData = {
        teacher: 'teacherken@gmail.com',
        students: [
          faker.internet.email(),
          faker.internet.email(),
        ],
      };

      const studentRepo = new StudentRepository();
      const stub = sinon.stub(studentRepo, 'findTaggedStudents').returns(expectedResult);

      const studentService = new Student(studentRepo);
      const { error, result } = await studentService.retrieveForNotification(stubData);

      expect(stub.calledOnce).to.be.true;
      expect(error).to.equal(null);
      expect(result.length).to.equal(expectedResult.length);
    });
  });
});