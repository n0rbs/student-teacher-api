const Moment = require('moment');
const { StudentModel, sequelize } = require('../database');

class StudentRepository {
  /**
   * Initialize student model
   */
  constructor() {
    this.student = StudentModel;
    this.table = 'students';
  }
  /**
   * Retrieve a student record
   * @param {string} email - The email address of the student
   */
  getStudent(email) {
    return this.student.findOne({ where: { email } });
  }
  /**
   * Save the student records in the student and students_teachers tables
   * @param {object} data - Contains an array of strings for students and a single teacher string
   */
  async save(data) {
    try {
      const { students, teacher } = data;
      let sValues = '', stValues = '', count = 0;

      students.forEach(student => {
        sValues += `${sValues ? ',': ''}("${student}", 0, "${Moment().format('YYYY-MM-DD')}", "${Moment().format('YYYY-MM-DD')}")`;
      });
      // Insert unregistered students
      await sequelize.query(`
        INSERT IGNORE INTO
          ${this.table}
        VALUES
          ${sValues}
      `);
      const newStudents = await this.findAllUnRegistered(data);
      if (newStudents.length > 0) {
        newStudents.forEach(student => {
          stValues += `${stValues ? ',': ''}(0, "${student}" ,"${teacher}", "${Moment().format('YYYY-MM-DD')}", "${Moment().format('YYYY-MM-DD')}")`;
        });
        const [stResult] = await sequelize.query(`
          INSERT IGNORE INTO
            students_teachers
          VALUES
            ${stValues}
        `);
        const { affectedRows } = stResult;
        count = affectedRows;
      }
      
      return count;
    } catch (err) {
      throw err;
    }
  }
  /**
   * Find students who are already registered under the teacher
   * @param {object} data - Contains an array of strings for students and a single teacher string
   */
  async findAllUnRegistered(data) {
    const { students, teacher } = data;
    // Check for existing records
    const [rows] = await sequelize.query(`
      SELECT 
        student
      FROM
        students_teachers
      WHERE 
        (student = "${students.join('" AND teacher = "' + teacher + '") OR (student = "')}" AND teacher = "${teacher}")
    `);
    const formattedRows = rows.map(({ student }) => student );
    const newStudents = students.filter(email => formattedRows.indexOf(email) === -1);

    return newStudents;
  }
  /**
   * Retrieve all common student emails based on the list of teachers
   * @param {object} - Contains the list of "teachers" as filters
   */
  async findAllCommon(data) {
    const { teachers } = data;
    let stWhereIn = '', result = [];
    if (teachers.length > 0) {
      const [teacher1] = teachers;
      if (teachers.length > 1) {
        teachers.forEach((teacher, key) => {
          if (key > 0) {
            stWhereIn += ` AND student IN (SELECT student FROM students_teachers WHERE teacher = "${teacher}")`;
          }
        });  
      }
      const sql = `
        SELECT
          student
        FROM
          students_teachers
        WHERE
          teacher = "${teacher1}" 
          ${stWhereIn}
      `;
      try {
        const [rows] = await sequelize.query(sql);
        result = rows.length === 0 ? [] : rows;
        
      } catch (err) {
        throw err;
      }
    }
    return result;
  }
  /**
   * 
   * @param {object} data - An iteratable object containing the field and value to be update
   * @param {string} student - The email or reference key of the student
   */
  async updateStudent(data, email) {
    try {
      return this.student.update(data, { where: { email }});
    } catch (err) {
      throw err;
    }
  }
  /**
   * Filter out the list of students tagged in the notifcation and/or under the teacher
   * @param {object} data - Contains an array of valid student emails and teacher email
   */
  async findTaggedStudents(data) {
    const { students, teacher } = data;
    const stWhere = `st.teacher = "${teacher}"` + (students.length === 0 ? ''
      : ` OR st.student = "${students.join('" OR st.student = "')}"`);

    const sql = `
      SELECT DISTINCT
        s.email
      FROM
        students s
        INNER JOIN students_teachers st ON s.email = st.student
      WHERE
        s.suspended = 0
        AND (
          (
            ${stWhere}
          )
        )
    `;
    try {
      const [sResult] = await sequelize.query(sql);

      return sResult;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = StudentRepository;
