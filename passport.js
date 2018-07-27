const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const Customer = require('./models/Customers');

module.exports = () => {
  // passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
  //   done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  // });

  // passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  //   done(null, user); // 여기의 user가 req.user가 됨
  // });

  passport.use(new FacebookStrategy({ // local 전략을 세움
    clientID: '2171887249551647',
    clientSecret: '616de2413c7086c4cfa3520ac67005a4',
    profileFields: ['email', 'name', 'id'],
  }, (req, accessToken, refreshToken, profile, done) => {
    console.log('11')
    Customer.findOne({ id: profile.id }, (err, user) => {
      console.log('22')
      if (user) return done(err, user); // 회원정보가 있으면 로그인
      const newCustomer = new Customer({
        id: profile.id
      });
      newCustomer.save((user) => {
        console.log('33')
        return done(null, user); // 새로운 회원 생성 후 로그인
      })

    });
  }));
};