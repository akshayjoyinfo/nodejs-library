const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');
const passport = require('passport');

const authRouter = express.Router();
const url = 'mongodb://localhost:27017';
const dbName = 'LibraryApp';

function router(navs) {
  debug('inside Auth router');
  authRouter.route('/signUp').post((req, res) => {
    const { username, password } = req.body;

    (async function createUser() {
      const client = await MongoClient.connect(url);
      try {
        debug('Signing Up User');

        const db = client.db(dbName);
        const user = { username, password };
        const col = await db.collection('users');
        const result = await col.insertOne(user);
        req.login(result.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err);
      }
      client.close();
    }());
  });

  authRouter.route('/signin').get((req, res) => {
    res.render('signIn', {
      title: 'Login To My Library',
      navs,
    });
  }).post(passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/',
  }));


  authRouter.route('/profile').all((req, res, next) => {
    if (req.user) {
      debug('Logged in successfully');
      next();
    } else {
      res.redirect('/');
    }
  }).get((req, res) => {
    res.json(req.user);
  });
  return authRouter;
}

module.exports = router;
