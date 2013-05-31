
/**
* Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , informacion = require('./routes/info')
  , path = require('path');

var sessionController = require('./routes/session_controller.js')
  , postController = require('./routes/post_controller.js')
  , userController = require('./routes/user_controller.js')
  , commentController = require('./routes/comment_controller.js');
  
var partials = require('express-partials');
var contador = require('./public/javascripts/count');

var util = require('util');

var app = express();
app.use(partials());
app.use(contador.count_mw);

// all environments
app.configure(function(){
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(require('connect-flash')());
    // Helper dinamico:
  app.use(function(req, res, next) {

     // Hacer visible req.flash() en las vistas
     res.locals.flash = function() { return req.flash() };

     // Hacer visible req.session en las vistas
     res.locals.session = req.session;

     next();
  });

app.use(sessionController.contSesion);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
});


app.use(function(err, req, res, next) {

  if (util.isError(err)) {
     next(err);
  } else {
     console.log(err);
     req.flash('error', err);
     res.redirect('/');
  }
});


if ('development' == app.get('env')) {
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
   app.use(express.errorHandler());
}


// Helper estatico:
app.locals.escapeText = function(text) {
   return String(text)
          .replace(/&(?!\w+;)/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/\n/g, '<br>');
};

// Routes
app.get('/', contador.count_mw, routes.index);
app.get('/info', informacion.ver);



// Auto-Loading:

app.param('postid', postController.load);
app.param('userid', userController.load);
app.param('commentid', commentController.load);

//---------------------

app.get('/login', sessionController.new);
app.post('/login', sessionController.create);
app.get('/logout', sessionController.destroy);

//---------------------

app.get('/posts/:postid([0-9]+)/comments',
commentController.index);

app.get('/posts/:postid([0-9]+)/comments/new',
sessionController.requiresLogin,
commentController.new);

app.get('/posts/:postid([0-9]+)/comments/:commentid([0-9]+)',
commentController.show);

app.post('/posts/:postid([0-9]+)/comments',
sessionController.requiresLogin,
commentController.create);

app.get('/posts/:postid([0-9]+)/comments/:commentid([0-9]+)/edit',
sessionController.requiresLogin,
commentController.loggedUserIsAuthor,
commentController.edit);

app.put('/posts/:postid([0-9]+)/comments/:commentid([0-9]+)',
sessionController.requiresLogin,
commentController.loggedUserIsAuthor,
commentController.update);

app.delete('/posts/:postid([0-9]+)/comments/:commentid([0-9]+)',
sessionController.requiresLogin,
commentController.loggedUserIsAuthor,
commentController.destroy);

// Comentarios Huerfanos
app.get('/orphancomments',
  commentController.orphans);

//---------------------

app.get('/posts.:format?', postController.index);

app.get('/posts/new',
        sessionController.requiresLogin,
        postController.new);

app.get('/posts/:postid([0-9]+).:format?', postController.show);
app.post('/posts',
sessionController.requiresLogin,
        postController.create);

app.get('/posts/:postid([0-9]+)/edit',
        sessionController.requiresLogin,
        postController.loggedUserIsAuthor,
        postController.edit);

app.put('/posts/:postid([0-9]+)',
        sessionController.requiresLogin,
        postController.loggedUserIsAuthor,
        postController.update);

app.delete('/posts/:postid([0-9]+)',
           sessionController.requiresLogin,
           postController.loggedUserIsAuthor,
           postController.destroy);

app.get('/posts/search', postController.search);

//---------------------

//---------------------

app.get('/users', userController.index);
app.get('/users/new', userController.new);
app.get('/users/:userid([0-9]+)', userController.show);
app.post('/users', userController.create);

app.get('/users/:userid([0-9]+)/edit',
        sessionController.requiresLogin,
userController.loggedUserIsUser,
        userController.edit);

app.put('/users/:userid([0-9]+)',
        sessionController.requiresLogin,
userController.loggedUserIsUser,
        userController.update);

// app.delete('/users/:userid([0-9]+)',
// sessionController.requiresLogin,
// userController.destroy);

//---------------------

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});