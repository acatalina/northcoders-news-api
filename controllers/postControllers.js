const {Users, Articles, Comments, Topics} = require('../models/models');

function postComment (req, res, next) {
  let newComment = new Comments({
    belongs_to: req.params.article_id,
    body: req.body.body
  });
  
  newComment.save(function (error, comment) {
    if (error) {
      res.status(500).send({error: error});
    }

    res.status(201).send({status: 'accepted'});
  });
};

module.exports = postComment;