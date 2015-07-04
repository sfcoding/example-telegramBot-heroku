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
  fs = require('fs'),
  telegramHeper = require('./helper/telegram');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('env', process.env.NODE_ENV || 'development');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));


var confFile = JSON.parse(fs.readFileSync(path.join(__dirname,'/config/telegram.json')), 'utf8');

var telegram = new telegramHeper(confFile.token);

telegram.setWebHook(confFile.webhook_url);


/**
 * Routes
 */
app.get('/',function(req,res,next){
  res.send('Working!asd1');
});

app.post('/update', function(req, res, next) {
  console.log('update!  %j', req.body);

  //parse all variable
  var message = req.body.message;
  var chatId = message.chat.id;
  var fromId = message.from.id;
  var messageId = message.message_id;
  var text = message.text.split(' ');

  var cmd = text[0].split(confFile.bot_name)[0];
  var option = text.slice(1);

  switch (cmd) {
    case '/hello':
      telegram.sendMessage(chatId, 'Hello World! '+option[0]);
      break;
    case '/help':
      telegram.sendMessage(chatId,'list of command:');
      break;
  }

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
if (app.get('env') === 'development') {
  app.use(errorhandler());
}

// production only
if (app.get('env') === 'production') {
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
}

/**
 * Start Server
 */
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
