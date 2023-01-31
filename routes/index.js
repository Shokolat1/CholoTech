var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CholoTech', sub: '¡Precios tan bajos, que parece que son robados!' });
});

module.exports = router;
