"use strict";

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    id: {type:DataTypes.INTEGER.UNSIGNED, unique: true, primaryKey: true},
    username: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.ComWords);
        Users.belongsToMany(models.PriWords,{
          //as: [Relationship2],
          through: 'Link_Users_ComWords',
          //foreignKey: 'user_id'
          });
        }
      }
  });
  return Users;
};
