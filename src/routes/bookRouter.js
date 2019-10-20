const express = require('express');
const bookController = require('../controllers/bookConttroller');
const goodreadsService = require('../services/goodreadsService');

const bookRouter = express.Router();

function router(nav) {
  const { getByIndex, getById, middleware } = bookController(goodreadsService, nav);

  bookRouter.use(middleware);
  bookRouter.route('/').get(getByIndex);
  bookRouter.route('/:id').get(getById);

  return bookRouter;
}
module.exports = router;
