const fs = require('fs');
const STATUS_CODES = require('../utils/costants');

// обработка ошибок
const writeLog = (req, err) => {
  fs.writeFile(
    'data.json',
    JSON.stringify(`{
    url: ${req.originalUrl},
    err: ${err.message},
    stack: ${err.stack},
  }`),
    (error) => {
      // eslint-disable-next-line no-console
      if (error) console.log(error);
    },
  );
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;
  writeLog(req, err);
  return res.status(statusCode).send({
    message:
      statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? 'Внутренняя ошибка сервера'
        : message,
  });
};

module.exports = errorHandler;
