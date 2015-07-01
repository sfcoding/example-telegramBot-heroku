"use strict";

module.exports = function(sequelize, DataTypes) {
  var ComWords = sequelize.define("ComWords", {
    //id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey:true},
    word: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        ComWords.belongsToMany(models.Users,{through: 'Link_Users_ComWords',
        //foreignKey: 'word_id'
        });
      }
    }
  });
  return ComWords;
};
