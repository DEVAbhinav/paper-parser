var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
//var noodle = require('noodlejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.get("/",function(req,res){
  var a=[ ];
  var base  = req.query.base;
  console.log("base value is " + base);
  var url = "http://m.thehindu.com/opinion/editorial/"; 
  request(url,function(error, response, html) {
    if(!error){
      var $ = cheerio.load(html);
      //console.log(html);
      $('.topStoriesList')
      .find('a')
      .each(function(i, elem) { 
        a[i] = $(this).attr('href');});
      

      request(a[base], function(err, response, html){
        if(!err){
          console.log(a[base] +" This is the url to which request is made!!");
          var $ = cheerio.load(html);
          var text = $('.hinduNewsBody').text();
          // Formating the result to be sent. 
          // Its an object containing 3 keys. 
          // 1. heading   2. body   3. image.  
          // Image and Heading are to be implemeted later on.

          var article = { 'body' : text}
          res.send(article);
          console.log(article);
        }
      })
    }
  });
})

module.exports = app;
app.listen('8080');
console.log("server is listening at 8080");