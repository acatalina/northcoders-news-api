const express = require('express');
const router = express.Router();
const getControllers = require('../controllers/getControllers');
const postComment = require('../controllers/postControllers');
const putControllers = require('../controllers/putControllers');
const deleteControllers = require('../controllers/deleteControllers');
const countComments = require('../countComments');

router.route('/').get(function (request, response) {
  response.status(200).send({status: 'OK'});
});

router.route('/test').get(countComments);

router.route('/topics').get(getControllers.getTopic);

router.route('/topics/:topic_id/articles').get(getControllers.getTopicArticles);

router.route('/articles').get(getControllers.getArticles);

router.route('/articles/:article_id/comments').get(getControllers.getArticleComments);

router.route('/articles/:article_id/comments').post(postComment);

router.route('/articles/:_id').put(putControllers.voteArticle);

router.route('/comments/:_id').put(putControllers.voteComment);

router.route('/comments/:_id').delete(deleteControllers.deleteComment);

router.route('/users/:username').get(getControllers.getUser);

module.exports = router;