"use strict";

module.exports = function(sequelize, DataTypes) {
  var Com-Words = sequelize.define("Com-Words", {
    id: DataTypes.INTEGER.UNSIGNED,
    word: DataTypes.STRING,
    money: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
  }, {
    classMethods: {
      associate: function(models) {
        Com-Words.belongsTo(models.Users)
      }
    }
  });
  return Com-Words;
};
