var express = require('express');
var router = express.Router();
//var authController = require('../controllers/auth');
//var mongoose = require('mongoose');
var Me = require('../../models/Me.js');

/* GET /me listing. */
router.get('/', function(req, res, next) {
  Me.get(req.lang, function (err, todos) {
    if (err) return next(err);
    res.json(todos[0]);
  });
});

/* POST /me */
router.post('/', /*authController.isAuthenticated,*/ function(req, res, next) {
  //req.body.user=req.user._id;
  var query = req.lang=='ita' ? {$set: {"bio.ita": req.body.bio}}:
                                {$set: {"bio.eng": req.body.bio}};
  if (req.body.img) query.$set.img = req.body.img;
  Me.update({}, query, {upsert:false}, function (err, post) {
    if (err)return next(err);
    res.json(post);
  });
});

/*
router.delete('/', authController.isAuthenticated, function(req, res, next) {
  Me.remove({user:req.user._id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
*/

module.exports = router;
