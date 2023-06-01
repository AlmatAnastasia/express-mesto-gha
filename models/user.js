const mongoose = require('mongoose');
// создать схему userSchema
const userSchema = new mongoose.Schema({
  // поля схемы пользователя:
  // имя пользователя (name), информация о пользователе (about), ссылка на аватарку (avatar)
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
// создать модель user и экспортировать её
module.exports = mongoose.model('user', userSchema);
