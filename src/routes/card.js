const cardRouter = require('express').Router();
const {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', removeCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
