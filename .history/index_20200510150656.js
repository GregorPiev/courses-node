/**Imports libraries**/
const express = require('express');
const path = require('path');
const csurf = require('csurf');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const password = 'piev180457';
const MONGODB_URI = `mongodb+srv://gregpiev:${password}@cluster0-lo4jr.mongodb.net/shop`;
/********/

/******Setting Express*************/
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const store = new MongoStore({
  collection: 'session',
  uri: MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
 app.use(session({
  secret: 'some secret values',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(varMiddleware);
app.use(userMiddleware);

/**Import routes**/
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const authRoutes = require('./routes/auth');
/********/
/**Routes. Set using them by expess**/
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
/***********************/

/*******Connection to DB and start server***********/
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    /* const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'gregpiev@mail.ru',
        name: 'Gregory',
        cart: { items: [] }
      });
      await user.save();
    } */


    app.listen(PORT, () => {
      console.log(`Server is running in port: ${PORT}`);
    });
  } catch (e) {
    console.log('Error connect to DB:', e);
  }


}
start();



