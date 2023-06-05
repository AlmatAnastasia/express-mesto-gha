const express = require('express');
const mongoose = require('mongoose');

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

require('./routes')(app);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен по порту 3000');
});
