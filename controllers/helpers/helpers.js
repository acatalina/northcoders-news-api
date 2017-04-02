function validateVote (res, query) {
  switch (query.vote) {
    case 'up':
      return 1;
    case 'down':
      return -1;
    default: 
      return res.status(400).send({reason: 'Invalid query'});
  }
}

function validateId (res, id) {
  if (id.length !== 24) {
    return res.status(400).send({reason: 'Invalid id'});
  }
  return id;
}

module.exports = {
  validateVote,
  validateId
};