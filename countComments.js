const async = require('async');
const mongoose = require('mongoose');
const {Users, Articles, Comments, Topics} = require('./models/models');

function countComment (req, res, next) {
  async.waterfall([
    function (next) {
      Articles.find({}, function(error, articles) {
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
    }
  ], function (error, articles) {
      if (error) {
        next(error);
      }
      res.status(200).send({articles: articles});
  });
}

module.exports = countComment;