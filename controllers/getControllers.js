const {Users, Articles, Comments, Topics} = require('../models/models');

function getTopic (req, res, next) {
  Topics.find({}, function (error, topics) {
    if (error) {
      return next(error);
    }

    res.status(200).send({topics: topics});
  });
};

function getTopicArticles (req, res, next) {
  Articles.find({belongs_to: req.params.topic_id}, function (error, articles) {
    if (error) {
      return next(error);
    }

    res.status(200).send({articles: articles});
  });
};

function getArticles (req, res, next) {
  Articles.find({}, function (error, articles) {
    if (error) {
      return next(error);
    }

    res.status(200).send({articles: articles});
  });
};

function getArticleComments (req, res, next) {
  Comments.find({belongs_to: req.params.article_id}, function (error, comments) {
    if (error) {
      return next(error);
    }

    res.status(200).send({comments: comments});
  });
};

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
  getTopicArticles,
  getArticles,
  getArticleComments,
  getUser
}