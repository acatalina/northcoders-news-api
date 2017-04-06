const validateVote = (res, query, next) => {
  switch (query.vote) {
    case 'up':
      return 1;
    case 'down':
      return -1;
    default: 
      return next({name: 'QUERY'});
  }
};

const validateId = (res, id, next) => {
  if (id.length !== 24) {
    return next({name: 'ID'});
  }
  
  return id;
};

module.exports = {
  validateVote,
  validateId
};