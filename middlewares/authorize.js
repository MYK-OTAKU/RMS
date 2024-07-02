const responses = require('../utils/responses');

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return responses.unauthorized(res, 'Vous n\'avez pas les autorisations nécessaires pour effectuer cette action.');
    }
    next();
  };
};

module.exports = authorize;
