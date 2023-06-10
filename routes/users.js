const router = require('express').Router();
const {
  getUsers,
  getUserByID,
  patchUserMe,
  patchAvatar,
} = require('../controllers/users');

// вернуть всех пользователей
router.get('', getUsers);
// вернуть пользователя по _id
router.get('/:userId', getUserByID);
// обновить профиль
router.patch('/me', patchUserMe);
// обновить аватар
router.patch('/me/avatar', patchAvatar);

module.exports = router;
