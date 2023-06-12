const express = require('express');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();
app.use(express.json());

app.use('/', router);
// app.use(errors());

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен по порту 3000');
});
