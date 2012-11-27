
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate');

var app = express();

// assign dust engine to .dust files
app.engine('dust', cons.dust);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'dust');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// HeroModel.find({}, function(err, heroes){
//   if(err){}
//   for (var i=0; i<heroes.length; i++) {
//     console.log('Hero ' + i + ' Name: ' + heroes[i].name + ' Base: ' + heroes[i].base);
//   }
// });
// Hero.save(function (err) {
//   if(err) {
//     console.log('Error: ' + err);
//   }
//   console.log('Save successful');
// });
/*var db = mongoose.createConnection('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});*/

app.get('/', routes.index);
app.post('/addhero', routes.addhero);
app.get('/getheroes', routes.getheroes);
//app.post('/', routes.calc);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
