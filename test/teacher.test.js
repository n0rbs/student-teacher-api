const sinon = require("sinon");
const faker = require("faker");
const { expect } = require('chai');

const Teacher = require('../lib/teacher');
const TeacherRepository = require('../lib/teacher/teacherRepository');

describe('Teacher', () => {
  describe('Techer exists', () => {
    it('should return an object if teacher exists', async () => {
      const expectedResult = {
        dataValues: { email: faker.internet.email() },
      };
      const stubData = faker.internet.email();

      const teacherRepo = new TeacherRepository();
      const stub = sinon.stub(teacherRepo, 'getTeacher').returns(expectedResult);

      const teacherService = new Teacher(teacherRepo);
      const result = await teacherService.exists(stubData);

      expect(stub.calledOnce).to.be.true;
      expect(result).to.equal(expectedResult);
    });
    it('should return null if teacher does not exist', async () => {
      const expectedResult = null;
      const stubData = faker.internet.email();

      const teacherRepo = new TeacherRepository();
      const stub = sinon.stub(teacherRepo, 'getTeacher').returns(expectedResult);

      const teacherService = new Teacher(teacherRepo);
      const result = await teacherService.exists(stubData);

      expect(stub.calledOnce).to.be.true;
      expect(result).to.equal(expectedResult);
    });

  });
});