const Users = require('../models/users');

const getUser = (req, res, next) => {
  let query = {username: req.params.username};

  Users.findOne(query, (error, user) => {
    if (error) {
      return next(error);
    } else if (!user) {
      return next({name: 'CastError'});
    }
    
    return res.status(200).send({user: user});
  });
};

module.exports = {
  getUser
};