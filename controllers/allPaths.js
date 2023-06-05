const STATUS_CODES = require('../utils/costants');

// обработать неправильные пути
const getNotFound = (req, res) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .send({ message: `${STATUS_CODES.NOT_FOUND}` });
};

module.exports = { getNotFound };
