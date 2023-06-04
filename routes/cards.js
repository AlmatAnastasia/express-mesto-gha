const router = require('express').Router();
const {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

// вернуть все карточки
router.get('/cards', getCards);
// удалить карточку по идентификатору
router.delete('/cards/:cardId', deleteCardByID);
// создать карточку
router.post('/cards', postCard);
// поставить лайк карточке
router.put('/cards/:cardId/likes', putCardLike);
// убрать лайк с карточки
router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
