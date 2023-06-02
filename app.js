const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();
app.use(express.json());

// авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '647509a5a5a594c3c6f3c681',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен по порту 3000');
});
