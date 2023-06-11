const STATUS_CODES = require('../utils/costants');
const { checkToken } = require('../utils/jwtAuth');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(STATUS_CODES.UNAUTHORIZED_ERROR).send({ message: 'Пользователь не авторизован' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(STATUS_CODES.UNAUTHORIZED_ERROR).send({ message: 'Пользователь не авторизован' });
  }
};

module.exports = auth;
