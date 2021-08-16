const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const { validateCard, validateId } = require('../middlewares/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCard, createCard);
cardRouter.delete('/:_id', validateId, removeCard);
cardRouter.put('/:_id/likes', validateId, likeCard);
cardRouter.delete('/:_id/likes', validateId, dislikeCard);

module.exports = cardRouter;
