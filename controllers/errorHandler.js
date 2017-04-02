const errorHandler = ((error) => {
  let errorName = error.errors.belongs_to.name;
  let errorValue = error.errors.belongs_to.value;
  let statusCode;
  let message;
  
  switch (errorName) {
    case 'CastError':
      statusCode = 404;
      message = {reason: `${errorValue} not found`};
      break;
    default:
      statusCode = 500;
      message = {error: error};
  }

  return {
    statusCode: statusCode,
    message: message
  };
});

module.exports = errorHandler;