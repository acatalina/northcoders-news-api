const express = require('express');
const router = express.Router();
const articles = require('../controllers/articles');
const comments = require('../controllers/comments');
const topics = require('../controllers/topics');
const users = require('../controllers/users');
var bodyParser = require('body-parser');

router.route('/').get(function (request, response) {
  response.status(200).send({status: 'OK'});
});

router.route('/topics').get(topics.getTopics);

router.route('/topics/:topic_id/articles').get(articles.getArticles);

router.route('/articles').get(articles.getArticles);

router.route('/articles/:article_id/comments').get(comments.getArticleComments);

router.route('/articles/:_id').put(articles.voteArticle);

router.route('/comments/:_id').put(comments.voteComment);

router.route('/comments/:_id').delete(comments.deleteComment);

router.route('/users/:username').get(users.getUser);

router.use(bodyParser.json());

router.route('/articles/:article_id/comments').post(comments.postComment);

module.exports = router;