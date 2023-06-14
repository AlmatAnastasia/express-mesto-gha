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
      if (error) console.log(error);
    },
  );
};

const errorHandler = (err, req, res, next) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;
  writeLog(req, err);
  next(res.status(statusCode).send({
    message:
      statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? 'Внутренняя ошибка сервера'
        : message,
  }));
};

module.exports = errorHandler;
