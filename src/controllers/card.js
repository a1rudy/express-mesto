const Card = require('../models/card');

const OK = 200;
const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(OK).send({ card }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` }));
};

const createCard = (req, res) => {
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
    .then((card) => res.status(OK).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const removeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      res.status(OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Введен некорректный id карточки: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: owner } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      res.status(OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные для постановки лайка: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: owner } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      res.status(OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные для снятии лайка: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
