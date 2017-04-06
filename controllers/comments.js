const {Comments, Articles} = require('../models/models');
const {validateVote, validateId} = require('./helpers/helpers');
const async = require('async');

const getArticleComments = (req, res, next) => {
  let _id = validateId(res, req.params.article_id, next);
  let query = {belongs_to: _id};

  Comments.find(query, (error, comments) => {
    if (error) return next(error);
    
    if (!comments.length) {
      return next({name: 'NOTHING'});
    }
    
    return res.status(200).send({comments: comments});
  });
};

const voteComment = (req, res, next) => {
  let vote = validateVote(res, req.query, next);
  let _id = validateId(res, req.params._id, next);

  Comments.findOneAndUpdate(
    {_id: _id},
    {$inc: {votes: vote}},
    {new: true},
    (error, comment) => {
      if (error) return next(error);
      
      if (!comment) {
        return next({name: 'NOTFOUND'});
      }
      
      return res.status(201).send({comment: comment});
  });
};

const postComment = (req, res, next) => {
  let _id = validateId(res, req.params.article_id, next);

  let newComment = new Comments({
    belongs_to: _id,
    body: req.body.body
  });

  const findArticleById = (next) => {
    Articles.findById (_id, (error, article) => {
      if (error) return next(error);
      
      if (!article) {
        return next({name: 'CastError'});
      }
      
      return next(null, article);
    });
  };

  const postComment = (article, done) => {
    newComment.save((error, comment) => {
      return error ? done(error) : done(null, comment);
    });
  };

  async.waterfall([
      findArticleById,
      postComment
      ], (error, comment) => {
        return error ? next(error) : res.status(201).send({comment: comment});
      }
    );
};

const deleteComment = (req, res, next) => {
  let _id = validateId(res, req.params._id, next);

  Comments.findOneAndRemove({_id: _id}, (error, comment) => {
    if (error) return next(error);
    
    if (!comment) {
      return next({name: 'CastError'});
    }
    
    return res.status(204).send();
  });
};

module.exports = {
  getArticleComments,
  voteComment,
  postComment,
  deleteComment
};