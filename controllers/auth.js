const crypto = require('crypto');
var uid = require('uid-safe')

const Product = require('../models/product');
const Order = require('../models/order');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Session = require('../models/session')
const { startSession } = require('../models/user');
const session = require('../models/session');
const TOKEN = `${process.env.BOT_KEY}`




const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.SERV_MAIL_AD,
    pass: process.env.SERV_MAIL_PASS,
  },
});

exports.getCartLink = (req, res, next) =>{
  uid(24)
  .then(uniqueString => {
  console.log(req.user);

  if (req.session.isLoggedIn == true){
  transporter.sendMail({
    to: req.session.user.email,
    from: 'yourshoptest@gmail.com',
    subject: 'Your cart',
    html: `
            <p>You requested card access link</p>
            <p>Click this <a href="${process.env.APP_ADDRESS}/getcart/${uniqueString}">link</a> To get your cart.</p>
          `
  });
  req.session.cartString = uniqueString
  res.render('auth/cartlink', {
    path: '/cartlink',
    pageTitle: 'Your cart link',
    Message: `This link leads to your cart (it was also sent to your email): ${process.env.APP_ADDRESS}/getcart/${uniqueString}`})

  }else{

  req.session.cartString = uniqueString
  res.render('auth/cartlink', {
    path: '/cartlink',
    pageTitle: 'Your cart link',
    Message: `This link leads to your cart: ${process.env.APP_ADDRESS}/getcart/${uniqueString}`})

  }})


}

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log('id', req.sessionID)
  // console.log('session', req.session)
  // console.log('sess', req.sess)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            Session.findOne({_id: req.sessionID})
            .then(session => {
            if (session){
              console.log('sess f')
              if (session.cart && session.cart.items && (session.cart.items != '')){
              console.log('session.cart.items', session.cart.items)
              user.cart = session.cart;
              req.session.isLoggedIn = true;
              req.session.user = user;
            }else{
                console.log('sess add')
                session.cart = user.cart;
                req.session.isLoggedIn = true;
                req.session.user = user;
                }
                session.save()
            }
            if (req.session.tg){
              user.tgName = req.session.tg
            }
            user.save();
          
             req.session.save();
          });
          return res.redirect('/cart');
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        role: 'user',
        cart: { items: [] },
        tgName: ''
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'yourshoptest@gmail.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })}else{res.redirect('/500')}});
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'yourshoptest@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="${process.env.APP_ADDRESS}/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.gook = (req, res) => {
  // Basically, you want a function that checks the signature of the incoming data, and deal with it accordingly
  checkSignature(req.query)
  .then(boola => {
    if (boola) {
      console.log('tr', req.query)
      let token = req.query.id
  // let data = ustr.split('&');
  // let token;
  // for (i=0 ; i < data.length; i++){
  //   if (data[i].indexOf("id=") != -1){
  //       let ndata = data[i].split('=');
  //       token = ndata[1];
  //       break;
  //   }
  // }                //, first_name, last_name, username, photo_url, auth_date и hash
  let ll;
  if (token){
  User.findOne({tgName: token })
    .then(user => {
      ll= user;
      if (!user){
      req.session.tg = token;
      req.session.save();
      return res.redirect('/login');
      }else{
      Session.findOne({_id: req.sessionID})
      .then(session => {
        if (session){
          console.log('sess f')
          if (session.cart && session.cart.items && (session.cart.items != '')){
          console.log('session.cart.items', session.cart.items)
          user.cart = session.cart;
          req.session.isLoggedIn = true;
          req.session.user = ll; 
          user.save();}else{
          console.log('sess add')
          session.cart = ll.cart;
          req.session.isLoggedIn = true;
          req.session.user = ll;
          session.save();
          }req.session.save()}}
          
      
      )
      
      return res.redirect('/products');
    }})

  
  
  }else{return res.redirect('/')};
  } else {
    console.log('rq', req.query)
    return res.redirect('/500')
    // data is not authenticated
    
    
  }})}
  
    

async function checkSignature({ hash, ...userData }) {
  
  // create a hash of a secret that both you and Telegram know. In this case, it is your bot token
  const secretKey = crypto.createHash('sha256')
  .update(TOKEN)
  .digest();

  // this is the data to be authenticated i.e. telegram user id, first_name, last_name etc.
  const dataCheckString = Object.keys(userData)
  .sort()
  .map(key => (`${key}=${userData[key]}`))
  .join('\n');

  // run a cryptographic hash function over the data to be authenticated and the secret
  const hmac = crypto.createHmac('sha256', secretKey)
  .update(dataCheckString)
  .digest('hex');


  console.log('hmac', hmac)
  console.log('hash', hash)
  // compare the hash that you calculate on your side (hmac) with what Telegram sends you (hash) and return the result
  return hmac === hash;

}

// async function getNTG(ustr){
//   let token = ustr.id
//   // let data = ustr.split('&');
//   // let token;
//   // for (i=0 ; i < data.length; i++){
//   //   if (data[i].indexOf("id=") != -1){
//   //       let ndata = data[i].split('=');
//   //       token = ndata[1];
//   //       break;
//   //   }
//   // }                //, first_name, last_name, username, photo_url, auth_date и hash
//   let ll;
//   if (token){
//   User.findOne({tgName: token })
//     .then(user => {
//       ll= user;
//       if (!user){
//       req.session.tg = token;
//       req.session.save();
//       return res.redirect('/login');
//       }else{
//       Session.findOne({_id: req.sessionID})
//       .then(session => {
//         if (session){
//           console.log('sess f')
//           if (session.cart && session.cart.items && (session.cart.items != '')){
//           console.log('session.cart.items', session.cart.items)
//           user.cart = session.cart;
//           req.session.isLoggedIn = true;
//           req.session.user = ll; 
//           user.save();}else{
//           console.log('sess add')
//           session.cart = ll.cart;
//           req.session.isLoggedIn = true;
//           req.session.user = ll;
//           session.save();
//           }req.session.save()}}
          
      
//       )
      
//       return res.redirect('/products');
//     }})

  
  
//   }else{return res.redirect('/')};
// }



exports.getTG = (req, res, next) => {
  const token = req.params.token;
  console.log(req.sessionID)
  let ll;
  if (token){
  User.findOne({tgName: token })
    .then(user => {
      ll= user;
      if (!user){
      req.session.tg = token;
      req.session.save();
      return res.redirect('/login');
      }else{
      Session.findOne({_id: req.sessionID})
      .then(session => {
        if (session){
          console.log('sess f')
          if (session.cart && session.cart.items && (session.cart.items != '')){
          console.log('session.cart.items', session.cart.items)
          user.cart = session.cart;
          req.session.isLoggedIn = true;
          req.session.user = ll; 
          user.save();}else{
          console.log('sess add')
          session.cart = ll.cart;
          req.session.isLoggedIn = true;
          req.session.user = ll;
          session.save();
          }req.session.save()}}
          
      
      )
      
      return res.redirect('/products');
    }})
  
    // Session.findById(req.sessionID)
    // .then(session => {
    //   console.log
    //   req.session = session;


  
  
  }else{return res.redirect('/')};
}


exports.getCart = (req, res, next) => {
  const token = req.params.token;
  let ss;
  let idlist =[];
  let cnt = 0;
  if (token){
    // Session.findById(req.sessionID)
    // .then(session => {
    //   console.log
    //   req.session = session;
    Session.findOne({'session.cartString': token })
    .then(session => {if (session){ss = session}})
    if (ss != undefined){
      Session.findOne({'_id': req.sessionID })
      .then(session => {
        if (req.session.isLoggedIn != true){
        
        ss
          .populate('cart.items.productId')
          .execPopulate()
          .then(ss => {
          let products = ss.cart.items;
          console.log(products)
          products.forEach(p => {
              if (p.productId.prices == 0){
                idlist.push(p.productId);
                cnt++;
              }; 
          });
        for (i=0; i<cnt; i++){
          ss
            .removesFromsCart(idlist[i]);
        }
        session.cart = ss.cart;
        session.save();
        });
      
      }else{
        session.cart = ss.cart;
        session.save();
      }
      
      })
  ///////
    
  return res.redirect('/cart')}else{return res.redirect('/')};}else{return res.redirect('/')};
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
