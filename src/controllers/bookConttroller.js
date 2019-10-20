const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  function getByIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'LibraryApp';

    (async function seed() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo client');

        const db = client.db(dbName);
        const col = await db.collection('books');
        const booksArray = await col.find().toArray();
        res.render('bookViewList', {
          title: 'Books',
          navs: nav,
          books: booksArray,
        });
      } catch (err) {
        debug(err);
      }
    }());
  }

  function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'LibraryApp';

    (async function seed() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo client');

        const db = client.db(dbName);
        const col = await db.collection('books');
        // eslint-disable-next-line no-undef
        const book = await col.findOne({ _id: new ObjectID(id) });

        book.details = await bookService.getBookById();

        res.render('bookView', {
          title: 'Book',
          navs: nav,
          book,
        });
      } catch (err) {
        debug(err);
      }
      client.close();
    }());
  }
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  return {
    getByIndex,
    getById,
    middleware,
  };
}

module.exports = bookController;
