var request = require('request');
function API (token){

  var createKeybord = function(key){
    return JSON.stringify({
      keyboard: key,
      one_time_keyboard: true,
      selective: true
    });
  };

  var parseReturn = function(body){
      var res = JSON.parse(body);
      if (res.ok)
        return res.result;
  };

  this.arrayToKeyboard = function(obj,key){
    var res = [];
    for (var i=0;i<obj.length;i++){
      res.push([obj[i][key]]);
    }
  };

  this.getMe = function(){
    request({
        url: 'https://api.telegram.org/bot'+token+'/getme',
        method: 'GET'
    }, function(error, response, body){
        console.log('getMe: %j',body);
        if(error) return null;
        else return parseReturn(body);
    });
  };

  this.sendMessage = function (chatId,text,msgId,key){
    var obj = {text: text, chat_id: chatId};
    if(msgId) obj.reply_to_message_id = msgId;
    if(key) obj.reply_markup = createKeybord(key);
    request({
        url: 'https://api.telegram.org/bot'+token+'/sendMessage',
        method: 'POST',
        form: obj,
    }, function(error, response, body){
        if(error) return null;
        else return parseReturn(body);
    });
  };

  this.setWebHook = function(webhook_url){
    request({
        url: 'https://api.telegram.org/bot'+token+'/setWebhook',
        method: 'POST',
        form: {url: webhook_url},
    }, function(error, response, body){
        if(error) return null;
        else return parseReturn(body);
    });
  };

}
module.exports = API;
