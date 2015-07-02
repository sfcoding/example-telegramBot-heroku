/**
 * Module dependencies
 */
var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  request = require('request'),
  path = require('path'),
  NodeCache = require( "node-cache" ),
  fs = require('fs'),
  winston = require('winston'),
  expressWinston = require('express-winston'),

  models = require("./models"),
  telegramHeper = require('./helper/telegram'),
  parseCommand = require('./helper/parseCommand');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

var TOKEN = process.env.TOKEN;
var WEBHOOK_URL = process.env.WEBHOOK_URL;
var BOT_NAME = process.env.BOT_NAME;
var telegram = new telegramHeper(TOKEN);
var myCache = new NodeCache( { stdTTL: 500/*, checkperiod: 120*/} );

// development only
if ('development' == app.get('env')) {
  console.log("development");
}

// production only
if ('production' == app.get('env')) {
  console.log("production");

  request({
      url: 'https://api.telegram.org/'+TOKEN+'/setWebhook',
      method: 'POST',
      form: {url: WEBHOOK_URL},
  }, function(error, response, body){
      if(error) {
          console.log(error);
      } else {
          console.log(response.statusCode, body);
      }
  });
}


/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://'+app.get('mongodb_uri')+'/personal', function(err) {
    if(err) {
        console.log('connection error', err);

    } else {
        console.log('connection successful');
        var test = require('./test/testdata.js');
        test.me();
        test.education();
        test.experience();
        test.projects();
        test.skills();
    }
});
*/

/**
 * Routes
 */

app.get('/',function(req,res,next){
  res.send('Working!asd1');
});

app.use('/debugdb',require('./routes/debugDB'));

//example of cache Object
/*
{
  cmd: '/adduser',
  option: [ 234234, ]
}
*/

app.post('/update', function(req, res, next) {
  console.log('update!  %j', req.body);

  //parse all variable
  var message = req.body.message;
  var chatId = message.chat.id;
  var fromId = message.from.id;
  var messageId = message.message_id;
  var text = message.text.split(' ');

  model.Users.findOne({
    where: {
      id: fromId
    }
  }).then(function(user){
    console.log(user);
    if (user){
      //check if the user have same operation in progress
      var cache_data = myCache.get( ''+chatId+fromId);
      if(cache_data){
        //myCache.del(''+chatId+fromId);
        cache_data.option.push(text[0]);
        parseCommand(messageId,cache_data);
      }else{
        //if find a command
        if (text[0][0] == '/'){
          var cmd = text[0].split(BOT_NAME)[0];
          //var option = text.slice(1);
          var cacheObj={
            cmd: cmd,
            option: [],
            chat_id: chatId,
            from_id: fromId,
            admin: user.admin
          };
          myCache.set(''+chatId+fromId,cacheObj);
          parseCommand(messageId,cacheObj);
          /*switch (cmd) {
            case '/hello':
              telegram.sendMessage(chatId, 'Hello World! - 2');
              break;
            case '/help':
              telegram.sendMessage(chatId,'list of command:');
              break;
            case '/addword':
              break;
          }*/
        }else{
          //check the words

        }
      }
      /*else if (cmd == '/adduser'){
        models.Users.create({id: message.from.id,
                             username: message.from.username,
                             name: message.from.first_name}).then(function(data){
                               console.log('add user %s with id %i',data.username,data.id);
                             });
      }*/
    }
  });


  res.send('ok');
});

/**
 * ERROR
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development only
if (env === 'development') {
  app.use(errorhandler());
  // development error handler
  // will print stacktrace
  /*app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status = (err.status || 500));
    res.render('error', {
      message: err.message,
      error: err
    });
  });*/
}

// production only
if (env === 'production') {
  //DEBUG_FILE
  /*var logDirectory = __dirname + '/log';
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.File({
          filename: logDirectory+'/error.log'
        })
      ],
      level: 'error'
    }));
    */
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status = (err.status || 500));
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  //For PASSENGER
  models.sequelize.sync().then(function () {
    app.listen();
    require('./test/dbdata')();
  });
}

/**
 * Start Server
 */
/*
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
*/
