"use strict";

module.exports = function(sequelize, DataTypes) {
  var PriWords = sequelize.define("PriWords", {
    //id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey:true},
    word: DataTypes.STRING,
    money: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
  }, {
    classMethods: {
      associate: function(models) {
        PriWords.belongsTo(models.Users);
      }
    }
  });
  return PriWords;
};
