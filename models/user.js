const mongoose = require('mongoose');
// создать схему userSchema
const userSchema = new mongoose.Schema({
  // поля схемы пользователя:
  // имя пользователя (name), информация о пользователе (about), ссылка на аватарку (avatar)
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});
// создать модель user и экспортировать её
module.exports = mongoose.model('user', userSchema);
