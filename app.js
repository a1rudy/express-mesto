const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

const userRoutes = require('./src/routes/user');
const cardRoutes = require('./src/routes/card');
const {
  createUser, login,
} = require('./src/controllers/user');
const { validateUser, validateLogin } = require('./src/middlewares/validation');
const auth = require('./src/middlewares/auth');
const NotFoundError = require('./src/errors/not-found-error');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый адрес не найден.');
});
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.kind === 'ObjectId') {
    res.status(400).send({
      message: 'Переданы некорректные данные.',
    });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка.'
        : message,
    });
  }

  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
