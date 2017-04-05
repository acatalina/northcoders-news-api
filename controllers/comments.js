const {Comments, Articles} = require('../models/models');
const {validateVote, validateId} = require('./helpers/helpers');
const async = require('async');

function getArticleComments (req, res, next) {
  let _id = validateId(res, req.params.article_id);
  let query = {belongs_to: _id};

  Comments.find(query, function (error, comments) {
    if (error) {
      return next(error);
    }
    if (!comments.length) {
      return res.status(204).send({});
    }
    
    return res.status(200).send({comments: comments});
  });
}

function voteComment (req, res, next) {
  let vote = validateVote(res, req.query);
  let _id = validateId(res, req.params._id);

  Comments.findOneAndUpdate(
    {_id: _id},
    {$inc: {votes: vote}},
    {new: true},
    function (error, comment) {
      if (error) {
        return next(error);
      } else if (!comment) {
        return res.status(404).send({reason: 'Not found'});
      }

      return res.status(201).send({comment: comment});
  });
}

function postComment (req, res, next) {
  let _id = validateId(res, req.params.article_id);

  let newComment = new Comments({
    belongs_to: _id,
    body: req.body.body
  });

  async.waterfall([
      function (next) {
        Articles.findById (_id, function (error, article) {
          if (error) {
            return next(error);
          } else if (!article) {
            return res.status(404).send({reason: 'Not found'});
          }

          return next(null, article);
        });
      },
      function (article, done) {
        newComment.save(function (error, comment) {
          return error ? done(error) : done(null, comment);
        });
      }], 
      function (error, comment) {
        return error ? next(error) : res.status(201).send({comment: comment});
      }
    );
}

function deleteComment (req, res, next) {
  let _id = validateId(res, req.params._id);

  Comments.findOneAndRemove({_id: _id}, function (error, comment) {
    if (error) {
      return next(error);
    } else if (!comment) {
      return res.status(404).send({reason: 'Not found'});
    }
    
    return res.status(204).send();
  });
}

module.exports = {
  getArticleComments,
  voteComment,
  postComment,
  deleteComment
};