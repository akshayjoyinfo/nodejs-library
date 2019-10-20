const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const navs = [
  { title: 'Books', link: '/books' },
  { title: 'Authors', link: '/authors' },
];

const dbConfig = {
  user: 'nodejs-admin',
  password: 'Password@123',
  server: 'node-js.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',

  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
};

// sql.connect(dbConfig).catch((err) => debug(err));

const bookRouter = require('./src/routes/bookRouter')(navs);
const adminRouter = require('./src/routes/adminRouter')(navs);
const authRouter = require('./src/routes/authRouter')(navs);

app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library'}));
require('./src/config/passport')(app)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render('index', {
    title: 'My Library',
    navs,
  });
});

app.listen(port, () => {
  debug(`Library APP to listening ${chalk.green(port)}`);
});
