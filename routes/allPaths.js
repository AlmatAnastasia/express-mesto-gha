const router = require('express').Router();
const { getNotFound } = require('../controllers/allPaths');

// обработать неправильные пути
router.patch('*', getNotFound);

module.exports = router;
