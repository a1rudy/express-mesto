const User = require('../models/user');

const OK = 200;
const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(OK).send({ user }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Введен некорректный id пользователя: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(OK).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const updateUser = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, {
    name,
    about,
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const updateUserAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, {
    avatar,
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении аватара: ${err}` });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
