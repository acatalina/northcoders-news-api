const express = require('express');
const router = express.Router();
const getControllers = require('../controllers/getControllers');
const postComment = require('../controllers/postControllers');

router.route('/').get(function (request, response) {
  response.status(200).send({status: 'OK'});
});

router.route('/topics').get(getControllers.getTopic);

router.route('/topics/:topic_id/articles').get(getControllers.getTopicArticles);

router.route('/articles').get(getControllers.getArticles);

router.route('/articles/:article_id/comments').get(getControllers.getArticleComments);

router.route('/articles/:article_id/comments').post(postComment);

module.exports = router;