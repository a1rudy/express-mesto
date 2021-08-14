const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error'); //400
const NotFoundError = require('../errors/not-found-error'); //404
const ConflictError = require('../errors/conflict-error'); //409
const UnauthorizedError = require('../errors/unauthorized-error') // 401

const { NODE_ENV, JWT_SECRET } = process.env;

const OK = 200;

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(OK).send({ user }))
    .catch(next)
};

const getOwner = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .then((user) => {
      if (!user) {
        // res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
        // return;
        throw new NotFoundError(`Пользователь по указанному id не найден (${err})`)
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Введен некорректный id пользователя (${err})`);
      }
    })
    .catch(err => next(err))
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
        // return;
        throw new NotFoundError(`Пользователь по указанному id не найден (${err})`)
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Введен некорректный id пользователя (${err})`);

      }
    })
    .catch(err => next(err))
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      }))
      .then((user) => res.status(OK).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError(`Переданы некорректные данные при создании пользователя (${err})`)
        }
        if (err.name === "MongoError" && err.code === 11000) {
          throw new ConflictError(`Пользователь с таким email уже существует (${err})`)
        }
      })
      .catch(next)
};

const updateUser = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, {
    name,
    about,
  }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Переданы некорректные данные при обновлении профиля (${err})`);
      }
    })
    .catch(next)
};

const updateUserAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, {
    avatar,
  }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Переданы некорректные данные при обновлении аватара (${err})`);
      }
    })
    .catch(next)
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'my-secret',
        { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getOwner,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
