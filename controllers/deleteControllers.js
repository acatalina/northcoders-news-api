const {Comments} = require('../models/models');

function deleteComment (req, res, next) {
  Comments.remove({_id: req.params._id}, function (error) {
    if (error) {
      next(error);
    }

    res.status(204).send();
  });
}

module.exports = {
  deleteComment
};