const { User } = require("../models/User");

//인증 처리를 하는 곳
let auth = (req, res, next) => {
  //클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;

  //토큰을 복호화 한 후 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //유저가 없으면 인증 실패
    if (!user) return res.json({ isAuth: false, error: true });

    //token과 user정보를 사용하기 위해 req에 넣어줌
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
