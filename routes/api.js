var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());

var candidateController = require('../controllers/api/candidate/candidateController');
var adminController = require('../controllers/api/admin/adminController');



///////////// candidate Controller start////////////////

router.post('/candidate-signin',candidateController.candidate_signin);
router.post('/candidate-registration',candidateController.candidate_registration);
router.post('/candidate-list',candidateController.candidateList);

///////////// candidate Controller ends////////////////



///////////// Admin Controller start////////////////

router.post('/admin-signin',adminController.admin_signin);

///////////// Admin Controller ends////////////////

module.exports = router;




