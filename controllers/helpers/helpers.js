function getVote (query) {
  let vote;

  if (query.vote === 'up') {
    vote = 1;
  } else if (query.vote === 'down') {
    vote = -1;
  }

  return vote;
}

function validateId (res, id) {
  if (id.length !== 24) {
    return res.status(400).send({reason: 'Invalid id'});
  } 
  return;
}

module.exports = {
  getVote,
  validateId
};