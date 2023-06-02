const userModel = require('../models/user');
const STATUS_CODES = require('../utils/costants');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

// обработка ошибок
const errorHandlingWithDataUSERS = (res, err, next) => {
  if (err.name === 'BadRequestError') {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      error: {
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      },
    });
    next(err);
  } else {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Внутренняя ошибка сервера',
      err: err.message,
      stack: err.stack,
    });
  }
};

const errorHandlingWithDataME = (res, err, next) => {
  if (err.name === 'BadRequestError') {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      error: {
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      },
    });
    next(err);
  } else if (err.name === 'CastError') {
    res.status(STATUS_CODES.NOT_FOUND).send({
      error: {
        message: 'Пользователь не найден',
        err: err.message,
        stack: err.stack,
      },
    });
    next(err);
  } else {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Внутренняя ошибка сервера',
      err: err.message,
      stack: err.stack,
    });
  }
};

// вернуть всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.send({ data: users });
  } catch (err) {
    errorHandlingWithDataUSERS(res, err, next);
  }
};

// вернуть пользователя по _id
const getUserByID = (req, res, next) => {
  const id = req.params.userId;
  userModel
    .findById(id)
    .orFail(() => {
      throw new Error('Не найдено');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.NOT_FOUND).send({
          error: {
            message: 'Пользователь не найден',
            err: err.message,
            stack: err.stack,
          },
        });
        next(err);
      } else {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

// создать пользователя
const postUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithDataUSERS(res, err, next);
    });
};

// обновить профиль
// { new: true, runValidators: true } - обновление, валидация
const patchUserMe = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  const bodyName = req.body.name;
  const bodyAbout = req.body.about;
  userModel
    .findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      if (bodyName === undefined || bodyAbout === undefined) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithDataME(res, err, next);
    });
};

// обновить аватар
const patchAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  const bodyAvatar = req.body.avatar;
  userModel
    .findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      if (bodyAvatar === undefined) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      errorHandlingWithDataME(res, err, next);
    });
};

module.exports = {
  getUsers,
  getUserByID,
  postUser,
  patchUserMe,
  patchAvatar,
};
