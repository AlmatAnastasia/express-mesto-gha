const cardModel = require('../models/card');
const STATUS_CODES = require('../utils/costants');

// вернуть все карточки
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

const errorHandlingWithDataLIKES = (res, err, next) => {
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

const getCards = async (req, res, next) => {
  try {
    const cards = await cardModel.find({});
    res.send({ data: cards });
  } catch (err) {
    errorHandlingWithDataUSERS(res, err, next);
  }
};

// удалить карточку по идентификатору
const deleteCardByID = (req, res) => {
  const owner = req.user._id;
  cardModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new Error('Не найдено');
    })
    .then((card) => {
      if (JSON.stringify(card.owner) !== `"${owner}"`) {
        res.send({
          message: 'Чужая карточка - нельзя удалить',
        });
      }
      cardModel
        .findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.NOT_FOUND).send({
          error: {
            message: 'Карточка не найдена',
            err: err.message,
            stack: err.stack,
          },
        });
      }
    });
};

// создать карточку
const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      errorHandlingWithDataUSERS(res, err, next);
    });
};

// поставить лайк карточке
const putCardLike = (req, res, next) => {
  const owner = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      // $addToSet - добавить _id в массив, если его там нет (Mongo)
      { $addToSet: { likes: owner } },
      { new: true },
    )
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      errorHandlingWithDataLIKES(res, err, next);
    });
};

// убрать лайк с карточки
const deleteCardLike = (req, res, next) => {
  const owner = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: owner } }, // $pull - убрать _id из массива (Mongo)
      { new: true },
    )
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      errorHandlingWithDataLIKES(res, err, next);
    });
};

module.exports = {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
};
