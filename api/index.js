var path = require('path');
var express = require('express');

var router = express.Router();

router.get('/project', function (req, res) {
  res.send('yup');
});

module.exports = router;