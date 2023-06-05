const userRouter = require('./users');
const cardRouter = require('./cards');
const allPaths = require('./allPaths');

module.exports = function router(app) {
  app.use('/users', userRouter);
  app.use('/cards', cardRouter);
  app.use(allPaths);
};
