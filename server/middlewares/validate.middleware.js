function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body || {});
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  validate,
};
