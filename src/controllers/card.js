const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const OK = 200;

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(OK).send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Переданы некорректные данные при создании карточки.`)
      }
    })
    .catch(next);
};

const removeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findById(cardId)
    .orFail(new NotFoundError(`Карточка с указанным id не найдена.`))
    .then(card => {
      if (card.owner.toString() == owner) {
        Card.findByIdAndDelete(cardId)
        .then((card) => res.status(OK).send(card))
        .catch(next)
      } else {
        throw new ForbiddenError('Отсутствуют права на уделение карточки.')
      }
      return res.status(OK).send({ message: 'Карточка удалена.' });
    })
    .catch(next);

};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: owner } },
    { new: true })
    .orFail(new NotFoundError('Карточка с указанным id не найдена.'))
    .then((card) => res.status(OK).send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: owner } },
    { new: true })
    .orFail(new NotFoundError('Карточка с указанным id не найдена.'))
    .then((card) => res.status(OK).send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
