const {Users, Articles, Comments, Topics} = require('../models/models');
const async = require('async');

function getTopic (req, res, next) {
  Topics.find({}, function (error, topics) {
    if (error) {
      return next(error);
    }

    res.status(200).send({topics: topics});
  });
}

function getArticles (req, res, next) {
  let query = {};
  let params = req.params.topic_id;

  if (params) {
    query = {belongs_to: params};
  }
  
  async.waterfall([
  function (next) {
    Articles.find(query, function (error, articles) {
      if (error) {
        return next(error);
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
    }, function (error, res) {
      done(error, res);
    });
  }], function (error, articles) {
    return error ? next(error) : res.status(200).send({articles: articles});
  });
}

function getArticleComments (req, res, next) {
  Comments.find({belongs_to: req.params.article_id}, function (error, comments) {
    if (error) {
      return next(error);
    }

    res.status(200).send({comments: comments});
  });
}

function getUser (req, res, next) {
  Users.find({username: req.params.username}, function (error, user) {
    if (error) {
      return next(error)
    }
    res.status(200).send({user: user})
  });
}

module.exports = {
  getTopic,
  getArticles,
  getArticleComments,
  getUser
}