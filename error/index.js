module.exports = (error, req, res, next) => {
  if (error) {
    let statusCode;
    let message;

    switch (error.name) {
      case 'CastError':
        statusCode = 404;
        message = {reason: 'Not found'};
        break;
      case 'ValidationError':
        statusCode = 400;
        message = {reason: error.errors.body.message};
        break;
      case 'NOTHING':
        statusCode = 204;
        break;
      case 'QUERY':
        statusCode = 400;
        message = {reason: 'Invalid query'};
        break;
      case 'ID':
        statusCode = 400;
        message = {reason: 'Invalid id'};
        break;
      default:
        statusCode = 500;
        message = {error: error};
    }

    return res.status(statusCode).send(message);
  }
};