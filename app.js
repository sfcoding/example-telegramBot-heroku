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
  models = require("./models");

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

app.post('/update', function(req, res, next) {
  console.log('update!  %j', req.body);
  var message = req.body.message;
  var text = message.text.split(' ');
  var cmd = text[0].split(BOT_NAME)[0];
  var option = text.slice(1);
  if (cmd =='/hello'){
    //Lets configure and request
    request({
        url: 'https://api.telegram.org/'+TOKEN+'/sendMessage',
        method: 'POST',
        form: {text: 'Hello World! - 1', chat_id: message.chat.id},
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
    if (cmd == '/adduser')
      models.Users.create({id: message.from.id,
                           username: message.from.username,
                           name: message.from.first_name}).then(function(data){
                             console.log('add user %s with id %i',data.username,data.id);
                           });
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
