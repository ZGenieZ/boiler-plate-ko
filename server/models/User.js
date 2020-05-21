const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //빈칸을 없애줌
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    //관리자를 구별하기 위해 사용
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    //유효성 관리
    type: String,
  },
  tokenExp: {
    //토큰의 유효기간
    type: Number,
  },
});

//유저 정보를 저장(user.save()하기 전에 func을 실행
userSchema.pre("save", function (next) {
  var user = this; //userSchema 객체

  //패스워드가 변경될때만 암호화 수행
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.(saltRounds = 암호화된 암호 자릿수)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      //hash = 암호화된 암호
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        //plain password 를 hash 암호화로 만든 암호로 교체
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//패스워드 비교 함수 만들기
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword를 암호화해서 db에 있는 암호화된 비밀번호랑 비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    //만약 에러뜨면 콜백함수에 err인자를 넣어서 반환, 에러가 없으면 err인자를 null, isMatch=true를 콜백함수의 인자로 넣어서 반환
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  //user._id + 'secretToken' = token 이다. secretToken을 알아여 user._id를 알 수 있으므로 변수로 저장한다.
  //_id는 string이 아니므로, mongoDB의 toHexString() 메서드를 사용하여 형변환을 해주어야 한다.
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 decode 한다.(이때 매개변수인 decoded가 user._id이다.)
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema); //스키마를 모델로 감싸기

module.exports = { User };
