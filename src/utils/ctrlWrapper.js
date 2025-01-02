const ctrlWrapper = (fn) => (req, res, next) => {
  return fn(req, res, next).catch(next);
};

export default ctrlWrapper;
