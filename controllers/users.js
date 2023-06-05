const fs = require('fs');
const userModel = require('../models/user');
const STATUS_CODES = require('../utils/costants');
// const BadRequestError = require('../errors/badRequestError');
// const NotFoundError = require('../errors/notFoundError');

// обработка ошибок
const writeLog = (req, err) => {
  fs.writeFile(
    'data.json',
    JSON.stringify(`{
    url: ${req.originalUrl},
    err: ${err.message},
    stack: ${err.stack},
  }`),
    (error) => {
      // eslint-disable-next-line no-console
      if (error) console.log(error);
    },
  );
};

const errorHandlingWithDataUSERS = (req, res, err) => {
  if (err.name === 'ValidationError') {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Переданы некорректные данные',
    });
  } else {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Внутренняя ошибка сервера',
    });
  }
  writeLog(req, err);
};

const errorHandlingWithData = (req, res, err) => {
  if (err.name === 'ValidationError') {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Переданы некорректные данные',
    });
  } else if (err.name === 'BadRequestError') {
    res.status(STATUS_CODES.NOT_FOUND).send({
      message: 'Пользователь не найден',
    });
  } else {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Внутренняя ошибка сервера',
    });
  }
  writeLog(req, err);
};

// вернуть всех пользователей
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(STATUS_CODES.OK).send({ data: users });
  } catch (err) {
    errorHandlingWithDataUSERS(req, res, err);
  }
};

// вернуть пользователя по _id
const getUserByID = (req, res) => {
  const id = req.params.userId;
  userModel
    .findById(id)
    .orFail(() => {
      res.status(STATUS_CODES.NOT_FOUND);
    })
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      // DocumentNotFoundError (404) - получение пользователя с некорректным id
      // CastError (400) - получение пользователя с несуществующим в БД id
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
      writeLog(req, err);
    });
};

// создать пользователя
const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithDataUSERS(req, res, err);
    });
};

// обновить профиль
// { new: true, runValidators: true } - обновление, валидация
const patchUserMe = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithData(req, res, err);
    });
};

// обновить аватар
const patchAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithData(req, res, err);
    });
};

module.exports = {
  getUsers,
  getUserByID,
  postUser,
  patchUserMe,
  patchAvatar,
};
