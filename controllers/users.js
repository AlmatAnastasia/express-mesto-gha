const userModel = require('../models/user');

// вернуть всех пользователей
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send({ data: users });
  } catch (err) {
    res.status(500).send({
      message: 'Внутренняя ошибка сервера',
      err: err.message,
      stack: err.stack,
    });
  }
};

// вернуть пользователя по _id
const getUserByID = (req, res) => {
  userModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('Не найдено');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'Не найдено') {
        res.status(404).send({
          message: 'Пользователь не найден',
        });
        return;
      }
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

// создать пользователя
const postUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

// обновить профиль
const patchUserMe = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(owner, { name, about }, { new: true })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

// обновить аватар
const patchAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUsers,
  getUserByID,
  postUser,
  patchUserMe,
  patchAvatar,
};
