const validator = require('validator');
const { celebrate, Joi, CelebrateError } = require('celebrate');

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный формат ссылки');
  }
  return value;
};

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidation),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidation),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateCard,
  validateUser,
  validateId,
  validateUpdateUser,
  validateUserAvatar,
  validateLogin,
};
