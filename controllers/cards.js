const cardModel = require('../models/card');
const STATUS_CODES = require('../utils/costants');
const BadRequestError = require('../errors/Bad_Request_Error');
const ForbiddenError = require('../errors/Forbidden_Error');
const NotFoundError = require('../errors/Not_Found_Error');

// вернуть все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await cardModel.find({});
    res.status(STATUS_CODES.OK).send({ data: cards });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
  }
};

// удалить карточку по идентификатору
const deleteCardByID = (req, res, next) => {
  const owner = req.user._id;
  const id = req.params.cardId;
  cardModel
    .findById(id)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      const ownerCard = card.owner.toString();
      if (ownerCard !== owner) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      cardModel
        .findByIdAndRemove(req.params.cardId)
        // eslint-disable-next-line arrow-body-style
        .then(() => {
          return res.status(STATUS_CODES.OK).send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'Карточка не найдена') {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (err.message === 'Нельзя удалить чужую карточку') {
        next(new ForbiddenError('Нельзя удалить чужую карточку'));
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
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
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
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'Карточка не найдена') {
        next(new NotFoundError('Карточка не найдена'));
      }
    });
};

// убрать лайк с карточки
const deleteCardLike = (req, res, next) => {
  const owner = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      // $pull - убрать _id из массива (Mongo)
      { $pull: { likes: owner } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'Карточка не найдена') {
        next(new NotFoundError('Карточка не найдена'));
      }
    });
};

module.exports = {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
};
