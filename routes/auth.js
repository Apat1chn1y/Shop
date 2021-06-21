const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

const TOKEN = `${process.env.BOT_KEY}`
// const TelegramLogin = require('node-telegram-login');
// const MySiteLogin = new TelegramLogin(TOKEN);
const getNTG = require('../controllers/auth')
const sha256 = require('js-sha256');


// We'll destructure req.query to make our code clearer
async function checkSignature(data) {
  console.log(data)
  let newDataStr = JSON.stringify(data);
  console.log('nd1',newDataStr )
  newDataStr = newDataStr.split(',');
  console.log('nd2',newDataStr )
  newDataStr = newDataStr.sort();
  console.log('nd3',newDataStr )
  newDataStr = newDataStr.join('\n')
  console.log('nd4',newDataStr )
  // create a hash of a secret that both you and Telegram know. In this case, it is your bot token
  data_check_string = newDataStr;
  secret_key = sha256(TOKEN)
  let shmack = sha256.hmac(data_check_string, secret_key);
  let nshmack = shmack.hex();
  if (nshmack == data.hash){
    console.log('true takoy true')
    return true
  }else{
    console.log('false takoy false')
    return false}
}

 
router.get('/nlogin', (req, res) => {
  // Basically, you want a function that checks the signature of the incoming data, and deal with it accordingly
  if (checkSignature(req.query) != true ) {
    console.log('rq', req.query)
    return res.redirect('/500')
    // data is not authenticated
  } else {
    console.log('rq', req.query)
    getTG(req.query);
    // data is authenticated
    // create session, redirect user etc.
    
  }
});


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.get('/tgAcc/:token', authController.getTG);

router.get('/cartlink', authController.getCartLink);

router.get('/getcart/:token', authController.getCart);

module.exports = router;
