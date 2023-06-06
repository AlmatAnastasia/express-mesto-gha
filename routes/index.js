const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const allPaths = require('./allPaths');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use(allPaths);

module.exports = router;
