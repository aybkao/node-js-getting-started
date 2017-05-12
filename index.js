var express = require('express');
var cool = require('cool-ascii-faces');
var path = require('path');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('./database/index.js');
var configAuth = require('./auth.js')
var app = express();


///// passport Google Strategy

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    console.log('id', profile.id);
    console.log('fn', profile.name.givenName);
    console.log('ln', profile.name.familyName);

    // user = new User({
    //   id: profile.id, 
    //   firstName: profile.name.givenName, 
    //   lastName: profile.name.familyName
    // });
    
    // user.save(function(err, user){
    //   if (err) {
    //     console.log("err", err)
    //   }
    // });

    User.find({'id': profile.id}, function(err, data) {
      if (err) {
        return done(err);
      }
      //if no data create new user with values from Google
      if (data.length === 0) {
        user = new User({
          id: profile.id, 
          firstName: profile.name.givenName, 
          lastName: profile.name.familyName
        });
        user.save(function(err, user) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        //found user. Return
        return done(err, data);
      }
    });
  }
));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', 
  { session: false, scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: '/'}), function(req, res) {
    res.redirect('/profile')
  });

app.get('/profile', function (req, res) {
  console.log('we got to the profile page');
  res.send('AUTHENTICATION OK!');
});


////////// Local Strategy

passport.use(new LocalStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    console.log('id', profile.id);
    console.log('fn', profile.name.givenName);
    console.log('ln', profile.name.familyName);

    // user = new User({
    //   id: profile.id, 
    //   firstName: profile.name.givenName, 
    //   lastName: profile.name.familyName
    // });
    
    // user.save(function(err, user){
    //   if (err) {
    //     console.log("err", err)
    //   }
    // });

    User.find({'id': profile.id}, function(err, data) {
      if (err) {
        return done(err);
      }
      //if no data create new user with values from Google
      if (data.length === 0) {
        user = new User({
          id: profile.id, 
          firstName: profile.name.givenName, 
          lastName: profile.name.familyName
        });
        user.save(function(err, user) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        //found user. Return
        return done(err, data);
      }
    });
  }
));

















app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/views/pages/index.html'));
});

app.get('/index_submit*', function(request, response) {
  console.log("somesubmission of whatever");
  response.send("submitted my user info")
})

app.get('/find', function(request, response) {
  User.find({}, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
  response.send(data);
  });
  //response.send("find success!");
})

app.get('/cool', function(request, response) {
  response.send(cool());
})

app.get('/times', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;
  for (var i = 0; i < times; i++) {
    result += i + ' ';
  }
  response.send(result);
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


