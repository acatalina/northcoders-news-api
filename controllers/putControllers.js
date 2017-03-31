const {Users, Articles, Comments, Topics} = require('../models/models');

function voteArticle (req, res, next) {
  let vote = getVote(req.query) || next('error');

  Articles.update(
    {_id: req.params._id},
    {$inc: {votes: vote}},
    function (error, document) {
    if (error) {
      next(error);
    }

    res.status(204).send({STATUS: document});
  });
}

function voteComment (req, res, next) {
  let vote = getVote(req.query);
  
  Comments.update(
    {_id: req.params._id},
    {$inc: {votes: vote}},
    function (error, document) {
    if (error) {
      next(error);
    }

    res.status(204).send({STATUS: document});
  });
}

function getVote (query) {
  let vote;

  if (query.vote === 'up') {
    vote = 1;
  } else if (query.vote === 'down') {
    vote = -1;
  }

  return vote;
}

module.exports = {
  voteArticle,
  voteComment
};