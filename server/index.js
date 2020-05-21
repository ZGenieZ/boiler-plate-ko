const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//application/x-www-form-urlencoded => url 형식으로 되어있는 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.urlencoded({ extended: true }));

// json 형식으로 되어있는 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello world! jinhee"));

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요 ~");
});

app.post("/api/users/register", (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
  /*req.body 안에는 json 형식으로 정보들이 들어있음(bodyParser 모듈로 사용가능) 
    ex) {
        id: "hello",
        password: "123"
    }
    */
  const user = new User(req.body);
  user.save((err, userInfo) => {
    //에러가 발생하면 json 형식으로 성공하지 못했다고 전달해주고 에러메시지를 함께 전달
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    //요청된 이메일이 DB에 없으면 json 형식으로 데이터 리턴
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호까지 같다면 토큰을 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키  or 로컬 스토리지(여기선 쿠키)
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//auth라는 middleware를 추가함
//※middleware란? => request를 받고 cb을 실행하기 전 동작(인증 처리)
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 middleware를 통과해 왔다는 얘기는 Authentication이 True라는 뜻.

  res.status(200).json({
    _id: req.user._id,
    //role이 0이면 유저 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃
app.get("/api/users/logout", auth, (req, res) => {
  //_id가 auth에서 가져온 req.user._id인 것을 select해서 token을 비움
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log("Example app listening on port " + port));
