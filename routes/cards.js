const router = require('express').Router();
const {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

// вернуть все карточки
router.get('', getCards);
// удалить карточку по идентификатору
router.delete('/:cardId', deleteCardByID);
// создать карточку
router.post('', postCard);
// поставить лайк карточке
router.put('/:cardId/likes', putCardLike);
// убрать лайк с карточки
router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;
