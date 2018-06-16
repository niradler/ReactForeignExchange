const router = require('express').Router();
const FXController = require('../controllers/FXController/FXController');

router.get('/get-table-data', FXController.getTableData);
router.get('/get-aggregated-table', FXController.getAggregatedTableData);
router.post('/currency-converter', FXController.currencyConvert);
router.get('/supported-currencies', FXController.getSupportedCurrencies);

module.exports = router;