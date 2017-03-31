const {Users, Articles, Comments, Topics} = require('../models/models');

function deleteComment (req, res, next) {
  Comments.remove({_id: req.params._id}, function (error, document) {
    if (error) {
      next(error);
    }

    res.status(204).send();
  });
};

module.exports = {
  deleteComment
}