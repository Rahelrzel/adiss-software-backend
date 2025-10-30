class HttpError extends Error {
  constructor({ status = 500, message, options = {} }) {
    super(message);
    this.status = status;
    this.options = options;
  }
}

export default HttpError;
