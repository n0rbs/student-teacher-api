const sinon = require("sinon");
const faker = require("faker");
const { expect } = require('chai');

const { StudentModel, sequelize } = require('../lib/database');
const StudentRepository = require('../lib/student/studentRepository');

describe('StudentRepository', () => {
  describe('Get Student', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should get one student record', async () => {
      const stubValue = {
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      const stub = sinon.stub(StudentModel, "findOne").returns(stubValue);
      const studentRepository = new StudentRepository();
      const student = await studentRepository.getStudent(stubValue.email);

      expect(stub.calledOnce).to.be.true;
      expect(student.email).to.equal(stubValue.email);
    });
  });
  describe('Update Student', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should update student record', async () => {
      const expectedResult = [1];
      const stubValue = {
        email: faker.internet.email(),
      };
      const updateStubValue = {
        suspended: true,
      }
      const stub = sinon.stub(StudentModel, "update").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.updateStudent(updateStubValue, stubValue.email);

      expect(stub.calledOnce).to.be.true;
      expect(result).to.equal(expectedResult);
    });
  });
  describe('Find all common students', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should find all common students for two teachers', async () => {
      const expectedResult = [
        [
          { email: faker.internet.email() },
          { email: faker.internet.email() },
        ],
      ];
      const stubValue = {
        teachers: [
          faker.internet.email(),
          faker.internet.email(),
        ],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findAllCommon(stubValue);

      expect(stub.calledOnce).to.be.true;
      expect(result.length).to.equal(expectedResult[0].length);
    });
    it('should find all students for one teacher', async () => {
      const expectedResult = [
        [
          { email: faker.internet.email() },
          { email: faker.internet.email() },
          { email: faker.internet.email() },
        ],
      ];
      const stubValue = {
        teachers: [
          faker.internet.email(),
        ],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findAllCommon(stubValue);

      expect(stub.calledOnce).to.be.true;
      expect(result.length).to.equal(expectedResult[0].length);
    });
    it('should return an empty result if there are no common students', async () => {
      const expectedResult = [
        [],
      ];
      const stubValue = {
        teachers: [
          faker.internet.email(),
          faker.internet.email(),  
        ],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findAllCommon(stubValue);

      expect(stub.calledOnce).to.be.true;
      expect(result.length).to.equal(expectedResult[0].length);
    });
    it('should return an empty result if one or more teachers are not provided', async () => {
      const expectedResult = [
        [],
      ];
      const stubValue = {
        teachers: [],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findAllCommon(stubValue);

      expect(stub.calledOnce).to.be.false;
      expect(result.length).to.equal(expectedResult[0].length);
    });
  });
  describe('Find tagged students in notification', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should find all students tagged in the notification', async () => {
      const expectedResult = [
        [
          { email: faker.internet.email() },
          { email: faker.internet.email() },
        ],
      ];
      const stubValue = {
        teacher: faker.internet.email(),
        students: [
          faker.internet.email(),
          faker.internet.email(),
        ],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findTaggedStudents(stubValue);

      expect(stub.calledOnce).to.be.true;
      expect(result.length).to.equal(expectedResult[0].length);
    });
    it('should find all students under a teacher if no one is tagged', async () => {
      const expectedResult = [
        [
          { email: faker.internet.email() },
          { email: faker.internet.email() },
          { email: faker.internet.email() },
        ],
      ];
      const stubValue = {
        teacher: faker.internet.email(),
        students: [],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findTaggedStudents(stubValue);

      expect(stub.calledOnce).to.be.true;
      expect(result.length).to.equal(expectedResult[0].length);
    });
  });
  describe('Find unregistered students under teacher', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should find registered students under teacher', async () => {
      const expectedResult = [
        [
          { email: faker.internet.email() },
          { email: faker.internet.email() },  
        ]
      ];
      const stubValue = {
        teacher: faker.internet.email(),
        students: [
          faker.internet.email(),
          faker.internet.email(),
        ],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      const result = await studentRepository.findAllUnRegistered(stubValue);

      expect(stub.calledOnce).to.be.true;
      expect(result.length).to.equal(expectedResult[0].length);
    });
  });

  describe('Save students under teacher', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('should save students under teacher', async () => {
      const expectedResult = [
        [
          { email: faker.internet.email() },
          { email: faker.internet.email() },  
        ]
      ];
      const stubValue = {
        teacher: faker.internet.email(),
        students: [
          faker.internet.email(),
          faker.internet.email(),
        ],
      };
      const stub = sinon.stub(sequelize, "query").returns(expectedResult);
      const studentRepository = new StudentRepository();
      sinon.stub(StudentRepository.prototype, "findAllUnRegistered").returns(stubValue.students);
      const result = await studentRepository.save(stubValue);

      expect(stub.calledOnce).to.be.false;
      // expect(result.length).to.equal(expectedResult[0].length);
    });
  });


});