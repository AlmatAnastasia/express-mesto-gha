const fs = require('fs');
const cardModel = require('../models/card');
const STATUS_CODES = require('../utils/costants');

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
  // CastError (400) - добавление/удаление лайка с некорректным id карточки
  // DocumentNotFoundError (404) - добавление/удаление лайка с несуществующим в БД id карточки
  if (err.name === 'CastError') {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Переданы некорректные данные',
    });
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(STATUS_CODES.NOT_FOUND).send({
      message: 'Карточка не найдена',
    });
  } else {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Внутренняя ошибка сервера',
    });
  }
  writeLog(req, err);
};

// вернуть все карточки
const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find({});
    res.status(STATUS_CODES.OK).send({ data: cards });
  } catch (err) {
    errorHandlingWithDataUSERS(req, res, err);
  }
};

// удалить карточку по идентификатору
const deleteCardByID = (req, res) => {
  const owner = req.user._id;
  cardModel
    .findById(req.params.cardId)
    .orFail(() => {
      res.status(STATUS_CODES.NOT_FOUND);
    })
    .then((card) => {
      if (JSON.stringify(card.owner) !== `"${owner}"`) {
        res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Чужая карточка - нельзя удалить',
        });
      }
      cardModel
        .findByIdAndRemove(req.params.cardId)
        .then(() => res.status(STATUS_CODES.OK).send({ data: card }));
    })
    .catch((err) => {
      errorHandlingWithData(req, res, err);
    });
};

// создать карточку
const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      errorHandlingWithDataUSERS(req, res, err);
    });
};

// поставить лайк карточке
const putCardLike = (req, res) => {
  const owner = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      // $addToSet - добавить _id в массив, если его там нет (Mongo)
      { $addToSet: { likes: owner } },
      { new: true },
    )
    .orFail(() => {
      res.status(STATUS_CODES.NOT_FOUND);
    })
    .then((card) => {
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      errorHandlingWithData(req, res, err);
    });
};

// убрать лайк с карточки
const deleteCardLike = (req, res) => {
  const owner = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      // $pull - убрать _id из массива (Mongo)
      { $pull: { likes: owner } },
      { new: true },
    )
    .orFail(() => {
      res.status(STATUS_CODES.NOT_FOUND);
    })
    .then((card) => {
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      errorHandlingWithData(req, res, err);
    });
};

module.exports = {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
};
