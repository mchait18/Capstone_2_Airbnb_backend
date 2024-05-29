const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isOwner !== undefined,
    "createToken passed user without isOwner property");

  let payload = {
    username: user.username,
    isOwner: user.isOwner || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
