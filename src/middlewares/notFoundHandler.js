import httpErrors from 'http-errors';

const notFoundHandler = (req, res, next) => {
  next(httpErrors(404, 'Route not found'));
};

export default notFoundHandler;
