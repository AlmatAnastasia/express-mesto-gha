const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const STATUS_CODES = require('../utils/costants');
const BadRequestError = require('../errors/Bad_Request_Error');
const UnauthorizedError = require('../errors/Unauthorized_Error');
const ConflictingRequestError = require('../errors/Conflicting_Request_Error');
const NotFoundError = require('../errors/Not_Found_Error');
const { signToken } = require('../utils/jwtAuth');

const SALT_ROUNDS = 10;

// вернуть всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.status(STATUS_CODES.OK).send({ data: users });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
  }
};

// вернуть информацию о текущем пользователе
const getUserMe = (req, res, next) => {
  const owner = req.user._id;
  userModel
    .findById(owner)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch(next);
};

// вернуть пользователя по _id
const getUserByID = (req, res, next) => {
  const id = req.params.userId;
  // const type = mongoose.Types.ObjectId.isValid(id);
  userModel
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      // 400 - получение пользователя с некорректным id
      // 404 - получение пользователя с несуществующим в БД id
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'Пользователь не найден') {
        next(new NotFoundError('Пользователь не найден'));
      }
    });
};

// обновить профиль
// { new: true, runValidators: true } - обновление, валидация
const patchUserMe = (req, res, next) => {
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
    .catch(next);
};

// обновить аватар
const patchAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch(next);
};

// регистрация пользователя (создать пользователя)
const postUser = (req, res, next) => {
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
            next(new ConflictingRequestError('Такой пользователь уже существует'));
            // eslint-disable-next-line no-useless-return
            return;
          }
        });
    });
};

// авторизация пользователя (проверить почту и пароль)
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email }).select('+password')
    // eslint-disable-next-line arrow-body-style
    .then((user) => {
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, match]) => {
      if (!match) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
        return;
      }
      const token = signToken({ _id: user._id });
      res.status(STATUS_CODES.OK).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserMe,
  getUserByID,
  patchUserMe,
  patchAvatar,
  postUser,
  loginUser,
};
