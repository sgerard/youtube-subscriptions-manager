var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        user: req.user,
        title: 'Youtube Subscriptions Manager'
  });
});

module.exports = router;
