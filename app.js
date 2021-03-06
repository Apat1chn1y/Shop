const path = require('path');
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');
const User = require('./models/user');
const Session = require('./models/session');
const {addcardtosess} = require('./actionwithdb')
require('dotenv').config();

const Slimbot = require('slimbot');
const slimbot = new Slimbot(`${process.env.BOT_KEY}`);


const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gc6yg.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
  // 'mongodb://127.0.0.1:27017'

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    path: '/',
    httpOnly: true,
    secret: 'my secret',
    maxAge: 86400000,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.use((req, res, next) => {

  let adm = false
  if ((req.session.isLoggedIn == true) && (req.session.user.role =='admin')){adm = true}
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = adm;
  
  next();
});

// slimbot.on('message', message => {
//   if ((message.text === "/Connect")||(message.text === "/Bot")) {

//     let optionalParams = {
//       'https://young-beach-36867.herokuapp.com/nlogin'
//             }
//           }
//         ]]
//       })
//     };

//     let optionalParams1 = {
//       parse_mode: 'Markdown',
//       reply_markup: JSON.stringify({
//         inline_keyboard: [[
//           { text: 'Bot',
//             login_url: {
//               url: 'https://t.me/Watzok_Watzokbot'
//             }
//           }
//         ]]
//       })
//     };

//     slimbot.sendMessage(message.chat.id, 'You can connect your telegram with our shop! You also can use our shop bot!', optionalParams);
//   } else if ((message.text != "/Connect")&&(message.text != "/Bot")) {
//     slimbot.sendMessage(message.chat.id, 'Click /Connect /Bot or type it into the chat!');
//   }
// });


slimbot.startPolling();

slimbot.on('message', message => {
  if ((message.text === "/Connect")||(message.text === "/Bot")) {
    if (message.text === "/Connect"){
    let optionalParams = {
      parse_mode: 'Markdown',
      reply_markup: JSON.stringify({
        inline_keyboard: [[
          { text: 'Connect',
            login_url: {
              url: 'https://young-beach-36867.herokuapp.com/nlogin'
            }
          }
        ]]
      })
    };

    slimbot.sendMessage(message.chat.id, 'Click this button to connect to shop!', optionalParams);
    slimbot.startPolling();
  }else if (message.text === "/Bot"){
    let optionalParams = {
      parse_mode: 'Markdown',
      reply_markup: JSON.stringify({
        inline_keyboard: [[
          { text: 'Bot',
            login_url: {
              url: 'https://t.me/Watzok_Watzokbot'
            }
          }
        ]]
      })
    };

    slimbot.sendMessage(message.chat.id, 'Click this button to get bot!', optionalParams);
    slimbot.startPolling();
  }
  } else if ((message.text === "/start")||((message.text != "/Connect")&&(message.text != "/Bot"))) {
    slimbot.sendMessage(message.chat.id, 'Click /Connect /Bot or type it into the chat!');
    slimbot.startPolling();
  }
  slimbot.startPolling();
});


// Call API



app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session) {
    return next();
  }
  Session.findById(req.sessionID)
    .then(session => {
      if (!session) {
        return next();
      }
      req.sess = session;
      console.log(req.sess)
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// app.use((req, res, next) => {
//   // throw new Error('Sync Dummy');
//   if (!req.session.card) {
//   addcardtosess(req.sessionID)
//   return next()}else{return next()}
    
// });

app.post('/create-order', isAuth, shopController.postOrder);

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  // let adm = false;
  // if ((req.session.isLoggedIn == true) && (req.session.user.role = 'admin')){adm = true}
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(result => {
    // https.createServer({key: privateKey, cert: certificate}, app)
    // .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
