const sinon = require("sinon");
const faker = require("faker");
const { expect } = require('chai');

const { TeacherModel } = require('../lib/database');
const TeacherRepository = require('../lib/teacher/teacherRepository');

describe('TeacherRepository', () => {
  describe('Get Teacher', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should get one teacher record', async () => {
      const stubValue = {
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      const stub = sinon.stub(TeacherModel, "findOne").returns(stubValue);
      const teacherRepo = new TeacherRepository();
      const teacher = await teacherRepo.getTeacher(stubValue.email);

      expect(stub.calledOnce).to.be.true;
      expect(teacher.email).to.equal(stubValue.email);
    });
  });
});