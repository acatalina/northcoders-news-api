const Users = require('../models/users');

function getUser (req, res, next) {
  let query = {username: req.params.username};

  Users.findOne(query, function (error, user) {
    if (error) {
      return next(error);
    } else if (!user) {
      return res.status(404).send({reason: 'Not found'});
    }
    
    return res.status(200).send({user: user});
  });
}

module.exports = {
  getUser
};