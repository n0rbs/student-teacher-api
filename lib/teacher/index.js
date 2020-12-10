class Teacher {
  /**
   * Initialize database source
   * @param {object} repository - Instance of TeacherRepository
   */
  constructor(repository) {
    this.db = repository;
  }
  /**
   * Verify if the teacher exists in the school
   */
  async exists(email) {
    try {
      const result = await this.db.getTeacher(email);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Teacher;