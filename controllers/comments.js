const {Comments} = require('../models/models');
const {getVote, validateId} = require('./helpers/helpers');

function getArticleComments (req, res, next) {
  let _id = req.params.article_id;
  let query = {belongs_to: _id};

  validateId(res, _id);

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
  let vote = getVote(req.query);
  
  Comments.findOneAndUpdate(
    {_id: req.params._id},
    {$inc: {votes: vote}},
    function (error) {
      return error ? next(error) : res.status(204).send();
  });
}

function postComment (req, res, next) {  
  let newComment = new Comments({
    belongs_to: req.params.article_id,
    body: req.body.body
  });
  newComment.save(function (error, comment) {
    return error ? next(error) : res.status(201).send({comment: comment});
  });
}

function deleteComment (req, res, next) {
  Comments.remove({_id: req.params._id}, function (error) {
    return error ? next(error) : res.status(204).send();
  });
}

module.exports = {
  getArticleComments,
  voteComment,
  postComment,
  deleteComment
};