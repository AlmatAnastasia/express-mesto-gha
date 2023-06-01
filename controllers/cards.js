const cardModel = require('../models/card');

// вернуть все карточки
const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find({});
    res.send({ data: cards });
  } catch (err) {
    res.status(500).send({
      message: 'Внутренняя ошибка сервера',
      err: err.message,
      stack: err.stack,
    });
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
      if (err.message === 'Не найдено') {
        res.status(404).send({
          message: 'Карточка не найдена',
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

// создать карточку
const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
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
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

// убрать лайк с карточки
const deleteCardLike = (req, res) => {
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
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
};
