module.exports = {
  success: (res, data, message = 'Success') => {
    res.status(200).json({
      status: 'success',
      message,
      data
    });
  },

  created: (res, data, message = 'Resource created successfully') => {
    res.status(201).json({
      status: 'success',
      message,
      data
    });
  },

  badRequest: (res, error, message = 'Bad Request') => {
    res.status(400).json({
      status: 'error',
      message,
      error
    });
  },

  unauthorized: (res, error, message = 'Unauthorized') => {
    res.status(401).json({
      status: 'error',
      message,
      error
    });
  },

  notFound: (res, error, message = 'Resource not found') => {
    res.status(404).json({
      status: 'error',
      message,
      error
    });
  },

  serverError: (res, error, message = 'Internal Server Error') => {
    res.status(500).json({
      status: 'error',
      message,
      error
    });
  }
};
