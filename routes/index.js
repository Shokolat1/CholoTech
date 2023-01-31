var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { tab: 'CholoTech - Índice', title: 'CholoTech', sub: '¡Precios tan bajos, que parece que son robados!' });
});

// Formulario para escoger productos
router.get('/escoger', function(req, res, next){
  res.render('form', {tab: 'CholoTech - Formulario de Búsqueda'})
})

// TODO:
// Pensando, mientras puppeteer encuentra la info

// TODO:
// Mostrar resultados
module.exports = router;
