const { celebrate, Joi } = require('celebrate');

// регулярное выражение для проверки ссылки (данных поля avatar)
// eslint-disable-next-line no-useless-escape
const regex = /^(http|https):\/\/(www)?[0-9a-z -._~:\/?#[\]@!$&'()*+,;=]*(#)?/i;

// регистрация пользователя
const validatorSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// авторизация пользователя
const validatorSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// вернуть пользователя по _id
// вернуть информацию о текущем пользователе
const validatorUserByID = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
});

// обновить профиль
const validatorPatchUserMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// обновить аватар
const validatorPatchAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
});

// удалить карточку по идентификатору
// поставить лайк карточке
// убрать лайк с карточки
const validatorCardByID = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }),
});

// создать карточку
const validatorPostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
});

module.exports = {
  validatorSignIn,
  validatorSignUp,
  validatorUserByID,
  validatorPatchUserMe,
  validatorPatchAvatar,
  validatorCardByID,
  validatorPostCard,
};
