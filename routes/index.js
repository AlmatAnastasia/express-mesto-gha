const router = require('express').Router();
const { errors } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const allPaths = require('./allPaths');
const {
  postUser, loginUser,
} = require('../controllers/users');
const { validatorSignIn, validatorSignUp } = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');

// регистрация пользователя
router.post('/signup', validatorSignUp, postUser);
// авторизация пользователя
router.post('/signin', validatorSignIn, loginUser);
// авторизация
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use(errors());
router.use(errorHandler);
router.use(allPaths);

module.exports = router;
