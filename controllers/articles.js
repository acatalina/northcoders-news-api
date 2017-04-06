const {Articles, Comments} = require('../models/models');
const async = require('async');
const {validateVote, validateId} = require('./helpers/helpers');

const getArticles = (req, res, next) => {
  let _id = req.params.topic;
  let query = _id ? {belongs_to: _id} : {};

  async.waterfall([
    (next) => {
      Articles.find(query, (error, articles) => {
        if (error) {
          return next(error);
        }
        if (!articles.length) {
          return next({name: 'NOTHING'});
        }
        next(null, articles);
      });
    },
    (articles, done) => {
      async.map(articles, (article, next) => {
        Comments.count({belongs_to: article._id}, (error, count) => {
          if (error) {
            return next(error);
          }
          article = article.toObject();
          article.comment_count = count;
          next(null, article);
        });
      }, 
      (error, res) => {
        done(error, res);
      });
    }], 
    (error, articles) => {
      return error ? next(error) : res.status(200).send({articles: articles});
    }
  );
};

const voteArticle = (req, res, next) => {
  let _id = validateId(res, req.params._id, next);
  let vote = validateVote(res, req.query, next);

  Articles.findByIdAndUpdate(
    {_id: _id},
    {$inc: {votes: vote}},
    {new: true},
    (error, article) => {
      return error ? next(error) : res.status(201).send({article: article});
  });
};

module.exports = {
  getArticles,
  voteArticle
};