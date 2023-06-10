const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const allPaths = require('./allPaths');
const {
  postUser, loginUser,
} = require('../controllers/users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
// авторизация пользователя
router.post('/signin', loginUser);
// создать пользователя
router.post('/signup', postUser);
router.use(allPaths);

module.exports = router;
