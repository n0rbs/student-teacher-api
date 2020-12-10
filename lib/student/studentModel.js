const Sequelize = require('sequelize');
const Model = Sequelize.Model;
class StudentModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        email: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.STRING,
        },
        suspended: {
          type: DataTypes.BOOLEAN,
        }
      },
      {
        sequelize,
        modelName: "students"
      }
    );
  }
}

module.exports = StudentModel;