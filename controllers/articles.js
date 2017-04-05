const {Articles, Comments} = require('../models/models');
const async = require('async');
const {validateVote, validateId} = require('./helpers/helpers');

function getArticles (req, res, next) {
  let _id = req.params.topic_id;
  let query = _id ? {belongs_to: _id} : {};

  async.waterfall([
    function (next) {
      Articles.find(query, function (error, articles) {
        if (error) {
          return next(error);
        }
        if (!articles.length) {
          return res.status(204).send({});
        }
        next(null, articles);
      });
    },
    function (articles, done) {
      async.map(articles, function (article, next) {
        Comments.count({belongs_to: article._id}, function (error, count) {
          if (error) {
            return next(error);
          }
          article = article.toObject();
          article.comment_count = count;
          next(null, article);
        });
      }, 
      function (error, res) {
        done(error, res);
      });
    }], 
    function (error, articles) {
      return error ? next(error) : res.status(200).send({articles: articles});
    }
  );
}

function voteArticle (req, res, next) {
  let _id = validateId(res, req.params._id);
  let vote = validateVote(res, req.query);

  Articles.findByIdAndUpdate(
    {_id: _id},
    {$inc: {votes: vote}},
    {new: true},
    function (error, article) {
      return error ? next(error) : res.status(201).send({article: article});
  });
}

module.exports = {
  getArticles,
  voteArticle
};