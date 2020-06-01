/**Imports libraries**/
const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
/* const password = 'piev180457'; */
/* const MONGODB_URI = `mongodb+srv://gregpiev:${password}@cluster0-lo4jr.mongodb.net/shop`; */
const keys = require('./keys');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
/********/

/******Setting Express*************/
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers')
});
const store = new MongoStore({
  collection: 'session',
  uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

/**Import routes**/
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
/********/
/**Routes. Set using them by expess**/
app.use('/', homeRoutes);
app.use('/profile', profileRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);
/***********************/

/*******Connection to DB and start server***********/
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server is running in port: ${PORT}`);
    });
  } catch (e) {
    console.log('Error connect to DB:', e);
  }


}
start();



