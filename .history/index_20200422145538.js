const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const User = require('./models/user');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');


const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const password = 'piev180457';
    const url = `mongodb+srv://gregpiev:${password}@cluster0-lo4jr.mongodb.net/shop`;
    console.log('URL:', url);    
    
    await mongoose.connect(url, {
       useNewUrlParser: true,
       useFindAndModify: false,
       useUnifiedTopology: true      
      });

    const candidate = await User.findOne();
    if(!candidate) {
      const user = new User({
        email: 'gregpiev@mail.ru',
        name: 'Gregory',
        cart: {items: []}
      });
      await user.save();
    }
    

    app.listen(PORT, () => {
      console.log(`Server is running in port: ${PORT}`);
    });
  } catch (e) {
    console.log('Error connect to DB:', e);
  }


}
start();



