const { TeacherModel } = require('../database');
class TeacherRepository {
  /**
   * Initialize teacher model
   */
  constructor() {
    this.teacher = TeacherModel;
    this.table = 'teachers';
  }
  /**
   * Retrieve teacher record
   * @param {string} email - Email of the teacher 
   */
  getTeacher(email) {
    return this.teacher.findOne({ where: { email } });
  }
}

module.exports = TeacherRepository;
