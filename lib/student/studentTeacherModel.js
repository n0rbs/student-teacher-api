const Sequelize = require('sequelize');
const Model = Sequelize.Model;
class TeacherModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        student: {
          type: DataTypes.STRING,
        },
        teacher: {
          type: DataTypes.STRING,
        },    
      },
      {
        sequelize,
        modelName: "students_teachers"
      }
    );
  }
}

module.exports = TeacherModel;