const UnauthorizedError = require('../errors/Unauthorized_Error');
const { checkToken } = require('../utils/jwtAuth');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
};

module.exports = auth;
