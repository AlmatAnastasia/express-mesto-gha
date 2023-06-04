const router = require('express').Router();
const {
  getUsers,
  getUserByID,
  postUser,
  patchUserMe,
  patchAvatar,
  getNotFound,
} = require('../controllers/users');

// вернуть всех пользователей
router.get('/users', getUsers);
// вернуть пользователя по _id
router.get('/users/:userId', getUserByID);
// создать пользователя
router.post('/users', postUser);
// обновить профиль
router.patch('/users/me', patchUserMe);
// обновить аватар
router.patch('/users/me/avatar', patchAvatar);
// обработать неправильные пути
router.patch('*', getNotFound);

module.exports = router;
