const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const allPaths = require('./allPaths');
const {
  postUser, loginUser,
} = require('../controllers/users');
const { validatorSignIn, validatorSignUp } = require('../middlewares/validate');

// регистрация пользователя
router.post('/signup', validatorSignUp, postUser);
// авторизация пользователя
router.post('/signin', validatorSignIn, loginUser);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use(allPaths);

module.exports = router;
