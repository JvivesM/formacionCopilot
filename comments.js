// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var User = require('../models/User');

// Get comments
router.get('/', function(req, res) {
  Comment.find({}, function(err, comments) {
    if (err) {
      return res.status(500).json({message: err.message});
    }
    res.json({comments: comments});
  });
});

// Post comments
router.post('/', function(req, res) {
  var comment = req.body;
  Comment.create(comment, function(err, comment) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'comment': comment, message: 'Comment Created'});
  });
});

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return next(new Error('can\'t find comment'));
    }
    req.comment = comment;
    return next();
  });
});

// Get comment
router.get('/:comment', function(req, res) {
  res.json({comment: req.comment});
});

// Delete comment
router.delete('/:comment', function(req, res) {
  req.comment.remove(function(err) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({message: 'Comment deleted'});
  });
});

// Update comment
router.put('/:comment', function(req, res) {
  var comment = req.comment;
  var update = req.body;
  Object.assign(comment, update);
  comment.save(function(err, comment) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'comment': comment, message: 'Comment Updated'});
  });
});

module.exports = router;