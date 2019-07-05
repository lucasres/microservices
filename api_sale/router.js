var express = require('express');
var SaleController = require('./controller/SaleController');

var router = express.Router();

router.get('/',SaleController.index);
router.post('/',SaleController.create);

module.exports = router;