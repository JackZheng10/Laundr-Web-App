const jwt = require("jsonwebtoken"),
  User = require("../models/User.js"),
  jwt_secret = process.env.secret || require("../config/config.js").secret,
  { showConsoleError, caughtError } = require("../helpers/errors");

// function to create tokens, access time is 24 hrs by default
const signToken = (user) => {
  const userData = user.toObject();
  delete userData.password;
  return jwt.sign(userData, jwt_secret); //formats it into the JWT encoded xx.xx.xx, to be served to frontend if needed
};

//function to verify tokens
const verifyToken = async (req, res, next) => {
  //token can come from header, body, params
  const token = req.get("token") || req.body.token || req.query.token;

  //reject user if no token
  if (!token) {
    return res.json({
      success: false,
      message: "A token is required for authentication.",
    });
  }

  //try to verify token provided
  jwt.verify(token, jwt_secret, async (error, decodedData) => {
    //error check from verifying token
    if (error) {
      return res.json({
        success: false,
        message: caughtError("verifying token provided", error, 99),
      });
    }

    try {
      //find user associated with token
      const user = await User.findById(decodedData._id);

      //reject token if no user found
      if (!user) {
        return res.json({
          success: false,
          message: "User associated with token could not be found.",
        });
      }

      //otherwise, theyve been authenticated and can move on in their route. not necessarily authorized yet
      res.locals.user = user;
      next();
    } catch (error) {
      showConsoleError("verifying token", error);
      return res.json({
        success: false,
        message: caughtError("verifying token", error, 99),
      });
    }
  });
};

module.exports = {
  signToken,
  verifyToken,
};
