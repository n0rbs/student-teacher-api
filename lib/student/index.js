class Student {
  /**
   * Initialize database source
   * @param {object} repository - Instance of StudentRepository
   */
  constructor(repository) {
    this.db = repository;
  }
  /**
   * save
   * @param {object} data - An object cointaining teacher and students email data
   */
  async register(data) {
    try {
      // const db = new StudentRepository();
      // TODO: Filter out students that are already registered
      const result = await this.db.save(data);
      return {
        error: null,
        result,
      };
    } catch (err) {
      throw err;
    }
  }
  /**
   * Return a list of common student emails under the provided teacher list
   * @param {object} data - Contains the teacher email
   */
  async listCommonStudents(data) {
    try {
      // const db = new StudentRepository();
      const result = await this.db.findAllCommon(data);
      return {
        error: null,
        result: result.map(({ student }) => student),
      };
    } catch (err) {
      throw err;
    }
  }
  /**
   * Suspend a student
   * @param {string} student - Email of the student or primary key
   */
  async suspend(student) {
    try { 
      let result = -1;
      const sResult = await this.db.getStudent(student);
      if (sResult) {
        const { dataValues: { suspended } } = sResult;
        result = suspended ? 0 : 1
        if (!suspended) {
          const [updateResult] = await this.db.updateStudent({
            suspended: true,
          }, student);
          result = updateResult;
        }
      }
      return {
        error: null,
        result,
      };
    } catch (err) {
      throw err;
    }
  }
  async retrieveForNotification(data) {
    try { 
      // TODO: Check validity of students
      const result = await this.db.findTaggedStudents(data);
      return {
        error: null,
        result: result.map(({ email }) => email),
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Student;
