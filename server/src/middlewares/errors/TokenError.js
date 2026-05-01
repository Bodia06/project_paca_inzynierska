class TokenError extends Error {
  constructor(message) {
    super(message || 'The access token is invalid or expired');
    this.code = 401;
  }
}

module.exports = TokenError;
