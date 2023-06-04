const router = require('express').Router();
const {
  getCards,
  deleteCardByID,
  postCard,
  putCardLike,
  deleteCardLike,
  getNotFound,
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
// обработать неправильные пути
router.get('*', getNotFound);
router.delete('*', getNotFound);
router.post('*', getNotFound);
router.put('*', getNotFound);

module.exports = router;
