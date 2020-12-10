const Sequelize = require('sequelize');
const Model = Sequelize.Model;
class TeacherModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        email: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "teachers"
      }
    );
  }
}

module.exports = TeacherModel;