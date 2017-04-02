const Users = require('../models/users');

function getUser (req, res, next) {
  let query = {username: req.params.username};

  Users.findOne(query, function (error, user) {
    return error ? next(error) : res.status(200).send({user: user});
  });
}

module.exports = {
  getUser
};