const Topics = require('../models/topics');

function getTopics (req, res, next) {
  Topics.find({}, function (error, topics) {
    return error ? next(error) : res.status(200).send({topics: topics});
  });
}

module.exports = {
  getTopics
};