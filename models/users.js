"use strict";

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    id: DataTypes.INTEGER.UNSIGNED,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Com-Words)
      }
    }
  });
  return Users;
};
