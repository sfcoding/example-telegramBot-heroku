var db = require('../models');

var insertTestUsers = function (){
  db.Users.create({
    id: 345,
    username: 'prova',
    name: 'provaName'
  }).then(function(task) {
    console.log('inserted '+task.name);// you can now access the newly created task via the variable task
  });
};

var insertTestComWords = function(){
  
};

module.exports = function(){
  insertTestUsers();
  insertTestComWords();
};
