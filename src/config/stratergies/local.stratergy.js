const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.stratergy');

const url = 'mongodb://localhost:27017';
const dbName = 'LibraryApp';

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        (async function createUser() {
          const client = await MongoClient.connect(url);
          try {
            debug('Logging to User');

            const db = client.db(dbName);

            const col = await db.collection('users');
            const isLoggedIn = await col.findOne({ username, password });
            if (isLoggedIn) {
              done(null, isLoggedIn);
            } else {
              done(null, false);
            }
          } catch (err) {
            debug(err);
          }
          client.close();
        }());
      },
    ),
  );
};
