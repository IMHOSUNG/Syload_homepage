var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var mysql_dbc = require('../commons/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection,'index');

var bcrypt = require('bcrypt');

var secret_config = require('../commons/secret');

var NaverStrategy = require('passport-naver').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;

var mysql_service = require('../service/mysqlService');


/**
 * */

/*로그인 성공시 사용자 정보를 Session에 저장한다*/
passport.serializeUser(function (user, done) {
  done(null, user)
});

/*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/*로그인 유저 판단 로직*/
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  connection.query('select * from `user` where `user_id` = ?', username, function (err, result) {
    if (err) {
      console.log('err :' + err);
      return done(false, null);
    } else {
      if (result.length === 0) {
        console.log('해당 유저가 없습니다');
        return done(false, null);
      } else {
        if (!bcrypt.compareSync(password, result[0].password)) {
          console.log('패스워드가 일치하지 않습니다');
          return done(false, null);
        } else {
          console.log('로그인 성공');
          return done(null, {
            user_id: result[0].user_id,
            nickname: result[0].nickname
          });
        }
      }
    }
  })
}));


/**
 * 1. 중복성 검사
 * 2. 신규 유저
 *  2.1 신규 유저 가입 시키기
 * 3. 올드유저
 *  3.1 바로 로그인 처리
 * */

function loginByThirdparty(info, done) {
  console.log('process : ' + info.auth_type);
  var stmt_duplicated = 'select *from `user` where `user_id` = ?';

  connection.query(stmt_duplicated, info.auth_id, function (err, result) {
    if (err) {
      return done(err);
    } else {
      if (result.length === 0) {
        // TODO 신규 유저 가입 시켜야됨
        var stmt_thridparty_signup = 'insert into `user` set `user_id`= ?, `nickname`= ?';
        connection.query(stmt_thridparty_signup, [info.auth_id, info.auth_name], function (err, result) {
          if(err){
            return done(err);
          }else{
            done(null, {
              'user_id': info.auth_id,
              'nickname': info.auth_name
            });
          }
        });
      } else {
        //  TODO 기존유저 로그인 처리
        console.log('Old User');
        done(null, {
          'user_id': result[0].user_id,
          'nickname': result[0].nickname
        });
      }
    }
  });
}

// naver login
passport.use(new NaverStrategy({
    clientID: secret_config.federation.naver.client_id,
    clientSecret: secret_config.federation.naver.secret_id,
    callbackURL: secret_config.federation.naver.callback_url,
    svcType : 0
  },
  function (accessToken, refreshToken, profile, done) {
  // var _profile = profile._json;
	process.nextTick(function () {
		//console.log("profile=");
		//console.log(profile);
		// data to be saved in DB
		user = {
			name: profile.displayName,
			email: profile.emails[0].value,
			username: profile.displayName,
			provider: 'naver',
			naver: profile._json
		};
		//console.log("user=");
		//console.log(user);
		return done(null, profile);
	});

  }	
  
));

// 페이스북으로 로그인 처리
passport.use(new FacebookStrategy({
    clientID: secret_config.federation.facebook.client_id,
    clientSecret: secret_config.federation.facebook.secret_id,
    callbackURL: secret_config.federation.facebook.callback_url,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
      'updated_time', 'verified', 'disesssplayName']
  }, function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;

    console.log('Facebook login info');
    console.info(_profile);

    loginByThirdparty({
      'auth_type': 'facebook',
      'auth_id': _profile.id,
      'auth_name': _profile.name,
      'auth_email': _profile.id
    }, done);
  }
));

// kakao로 로그인
passport.use(new KakaoStrategy({
    clientID: secret_config.federation.kakao.client_id,
    callbackURL: secret_config.federation.kakao.callback_url
  },
  function (accessToken, refreshToken, profile, done) {
   	
	       process.nextTick(function () {
                //console.log("profile=");
                //console.log(profile);
                // data to be saved in DB
                user = {
                        name: profile.username,
                        roles : ['authenticated'],
                        username: profile.id,
                        provider: 'kakao',
                        kakao: profile._json
                };
                //console.log("user=");
                //console.log(user);
                return done(null, profile);
        });

	 
  }
));

// naver 로그인
//console.log('naver');
router.get('/auth/login/naver',
  passport.authenticate('naver', null) , function(req, res) {
	console.log('/auth/login/naver failed, stopped');  
}
);
// naver 로그인 연동 콜백

//console.log('callback naver');
router.get('/auth/login/naver/callback/',
  passport.authenticate('naver', {
	failureRedirect : '#!/auth/login/'	
 }), function(req, res){
	console.log("naver login success");
	console.log("naver callback");
	console.log(user);
	//console.log(profile);
	/*	
	res.cookie("user", user[0] , {
		secure : true,
		expires : new Date(Date.now() + 9000000)
	});*/
	req.session.user = user["name"];

	req.session.save(function(){
		res.redirect('/');
 	});
});

// kakao 로그인
router.get('/auth/login/kakao',
  passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/login'
  }), function (req, res) {
	console.log("kakao login success");
	console.log(user);

	req.session.user = user["name"];
	req.session.save(function(){
		res.redirect('/');
	});
});

// facebook 로그인
router.get('/auth/login/facebook',
  passport.authenticate('facebook')
);
// facebook 로그인 연동 콜백
router.get('/auth/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);


/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {
    title: '서애로',
    user : req.session.user
  });
 
});


router.get('/login', function (req, res) {

  if (req.user !== undefined) {
    res.redirect('/')
  } else {
    res.render('login', {
      user : req.session.user
    })
  }

});

/*
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    res.redirect('/home');
  });
*/
/*Log out*/
router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy(function(){req.session;});
  res.redirect('/');
});


router.get('/myinfo', isAuthenticated, function (req, res) {
  res.render('myinfo', {
    title: 'My Info',
    user_info: req.user
  })
});


/*router.get('/mutiple/insert', function (req, res) {
    
    mysql_service.multipleInsert();
    
    
});*/

module.exports = router;
