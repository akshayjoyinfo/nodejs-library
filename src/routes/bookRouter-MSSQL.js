const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRouter');

const bookRouter = express.Router();

function router(nav) {
  const books = [
    {
      author: 'Chinua Achebe',
      country: 'Nigeria',
      imageLink: 'images/things-fall-apart.jpg',
      language: 'English',
      link: 'https://en.wikipedia.org/wiki/Things_Fall_Apart\n',
      pages: 209,
      title: 'Things Fall Apart',
      year: 1958,
    },
    {
      author: 'Hans Christian Andersen',
      country: 'Denmark',
      imageLink: 'images/fairy-tales.jpg',
      language: 'Danish',
      link:
        'https://en.wikipedia.org/wiki/Fairy_Tales_Told_for_Children._First_Collection.\n',
      pages: 784,
      title: 'Fairy tales',
      year: 1836,
    },
    {
      author: 'Dante Alighieri',
      country: 'Italy',
      imageLink: 'images/the-divine-comedy.jpg',
      language: 'Italian',
      link: 'https://en.wikipedia.org/wiki/Divine_Comedy\n',
      pages: 928,
      title: 'The Divine Comedy',
      year: 1315,
    },
    {
      author: 'Unknown',
      country: 'Sumer and Akkadian Empire',
      imageLink: 'images/the-epic-of-gilgamesh.jpg',
      language: 'Akkadian',
      link: 'https://en.wikipedia.org/wiki/Epic_of_Gilgamesh\n',
      pages: 160,
      title: 'The Epic Of Gilgamesh',
      year: -1700,
    },
    {
      author: 'Unknown',
      country: 'Achaemenid Empire',
      imageLink: 'images/the-book-of-job.jpg',
      language: 'Hebrew',
      link: 'https://en.wikipedia.org/wiki/Book_of_Job\n',
      pages: 176,
      title: 'The Book Of Job',
      year: -600,
    },
    {
      author: 'Unknown',
      country: 'India/Iran/Iraq/Egypt/Tajikistan',
      imageLink: 'images/one-thousand-and-one-nights.jpg',
      language: 'Arabic',
      link: 'https://en.wikipedia.org/wiki/One_Thousand_and_One_Nights\n',
      pages: 288,
      title: 'One Thousand and One Nights',
      year: 1200,
    },
    {
      author: 'Unknown',
      country: 'Iceland',
      imageLink: 'images/njals-saga.jpg',
      language: 'Old Norse',
      link: 'https://en.wikipedia.org/wiki/Nj%C3%A1ls_saga\n',
      pages: 384,
      title: "Nj\u00e1l's Saga",
      year: 1350,
    },
    {
      author: 'Jane Austen',
      country: 'United Kingdom',
      imageLink: 'images/pride-and-prejudice.jpg',
      language: 'English',
      link: 'https://en.wikipedia.org/wiki/Pride_and_Prejudice\n',
      pages: 226,
      title: 'Pride and Prejudice',
      year: 1813,
    },
    {
      author: 'Honor\u00e9 de Balzac',
      country: 'France',
      imageLink: 'images/le-pere-goriot.jpg',
      language: 'French',
      link: 'https://en.wikipedia.org/wiki/Le_P%C3%A8re_Goriot\n',
      pages: 443,
      title: 'Le P\u00e8re Goriot',
      year: 1835,
    },
  ];

  bookRouter.route('/').get((req, res) => {
    (async function query() {
      try {
        const request = new sql.Request();

        const { recordset } = await request.query('SELECT * from dbo.Books');

        res.render('bookViewList', {
          title: 'Books',
          navs: nav,
          books: recordset,
        });
      } catch (err) {
        debug(err);
      }
    }());
  });

  bookRouter.route('/:id').get((req, res) => {
    const { id } = req.params;

    (async function query() {
      try {
        const request = new sql.Request();

        const { recordset } = await request.input('Id', sql.Int, id).query(
          'SELECT * from dbo.Books where Id = @Id',
        );

        res.render('bookView', {
          title: 'Book',
          navs: nav,
          book: recordset[0],
        });
      } catch (err) {
        debug(err);
      }
    }());
  });

  return bookRouter;
}
module.exports = router;
