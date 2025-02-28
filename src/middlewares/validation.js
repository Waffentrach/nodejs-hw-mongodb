import httpErrors from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(httpErrors(400, error.message));
    }
    next();
  };
};
