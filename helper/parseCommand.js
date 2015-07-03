var TelegramHelper = require('./telegram');
var telegram = new TelegramHelper(process.env.TOKEN);
var db = require('../models');

var callbacks = {
  '/addword': {
      option : [
        function(msgId,data){ //CHOUSE USER
          db.Users.findAll({}).then(function(userList){
            var keyArray = telegram.arrayToKeyboard(userList,'name');
            telegram.sendMessage(data.chat_id,'choose an user..',msgId,keyArray);
          });
        },
        function(msgId,data){ //WRIATE A WORD
          telegram.sendMessage(data.chat_id,'write a word',msgId);// will need force replay object
        }
      ],
      exec: function(msgId,data){
        //add the word to the database
      },
      admin: true
  },
  '/help': {
    option: null,
    exec: function(msgId,data){
      telegram.sendMessage(data.chat_id,'lista comandi',msgId);
    },
    admin: false
  }
};

var parseCommand = function(msgId, data, myCache){
  var cmdCB = callbacks[data.cmd];
  if (cmdCB.admin==data.admin){
    if (cmdCB.option && cmdCB.option.length > data.option.length)
      cmdCB.option[data.option.length](msgId, data);
    else{
      myCache.del(''+data.chat_id+data.from_id);
      cmdCB.exec(msgId,data,myCache);
    }
  }else {
    telegram.sendMessage(data.chat_id,'Non sei admin!',msgId);
  }
};

module.exports = parseCommand;
