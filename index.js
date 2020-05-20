const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//application/x-www-form-urlencoded => url 형식으로 되어있는 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.urlencoded({ extended: true }));

// json 형식으로 되어있는 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json());

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

app.post("/register", (req, res) => {
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

app.listen(port, () => console.log("Example app listening on port " + port));
