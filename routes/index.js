

var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/api/v1/login');
  //res.render('index', { title: 'Express' });
});
router.get('/download-file/:file', function(req, res) {
    const { file } = req.params
    if(file!=''){
        res.download('./public/reports/'+file);
    } else {
        res.redirect('/api/v1/login');
    }
});
module.exports = router;
