const fs = require('fs');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const STATUS_CODES = require('../utils/costants');
const { signToken } = require('../utils/jwtAuth');

const SALT_ROUNDS = 10;
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

const errorHandlingWithData = (req, res, err) => {
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

const errorHandlingWithIdData = (req, res, err) => {
  // 400 - некорректные данные (обновление данных пользователя)
  if (err.name === 'CastError' || err.name === 'ValidationError') {
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

// вернуть всех пользователей
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(STATUS_CODES.OK).send({ data: users });
  } catch (err) {
    errorHandlingWithData(req, res, err);
  }
};

// вернуть информацию о текущем пользователе
const getUserMe = (req, res) => {
  const owner = req.user._id;
  userModel
    .findById(owner)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch(() => {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

// вернуть пользователя по _id
const getUserByID = (req, res) => {
  const id = req.params.userId;
  userModel
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      // 400 - получение пользователя с некорректным id
      // 404 - получение пользователя с несуществующим в БД id
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.message === 'Пользователь не найден') {
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

// регистрация пользователя (создать пользователя)
const postUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      userModel
        .create({
          name, about, avatar, email, password: hash,
        })
        .then(() => {
          res.status(STATUS_CODES.OK).send({
            data: {
              name, about, avatar, email,
            },
          });
        })
        .catch((err) => {
          if (err.code === STATUS_CODES.MONGO_DUPLICATE_KEY_ERROR) {
            res.status(STATUS_CODES.CONFLICTING_REQUEST).send({ message: 'Такой пользователь уже существует' });
            return;
          }
          errorHandlingWithData(req, res, err);
        });
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
      errorHandlingWithIdData(req, res, err);
    });
};

// обновить аватар
const patchAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithIdData(req, res, err);
    });
};

// авторизация пользователя (проверить почту и пароль)
const loginUser = (req, res) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email }).select('+password')
    // eslint-disable-next-line arrow-body-style
    .then((user) => {
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, match]) => {
      if (!match) {
        res.status(STATUS_CODES.UNAUTHORIZED_ERROR).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      const token = signToken({ _id: user._id });
      res.status(STATUS_CODES.OK).send({ token });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(STATUS_CODES.UNAUTHORIZED_ERROR).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

module.exports = {
  getUsers,
  getUserMe,
  getUserByID,
  postUser,
  patchUserMe,
  patchAvatar,
  loginUser,
};
