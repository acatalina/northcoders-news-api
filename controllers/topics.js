const Topics = require('../models/topics');

const getTopics = (req, res, next) => {
  Topics.find({}, (error, topics) => {
    return error ? next(error) : res.status(200).send({topics: topics});
  });
};

module.exports = {
  getTopics
};