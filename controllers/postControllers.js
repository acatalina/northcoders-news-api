const {Comments} = require('../models/models');

function postComment (req, res, next) {  
  let newComment = new Comments({
    belongs_to: req.params.article_id,
    body: req.body.body
  });
  newComment.save(function (error, comment) {
    if (error) {
      next(error);
    }
  
    res.status(201).send({comment: comment});
  });
}

module.exports = postComment;