const router = require('express').Router();
const FXController = require('../controllers/FXController/FXController');

router.get('/get-table-data', FXController.getTableData);

module.exports = router;