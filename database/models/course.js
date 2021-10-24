'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {

    static associate(models) {
      // define association here
    }
  };
  Course.init({
    course_name: DataTypes.STRING,
    author: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
