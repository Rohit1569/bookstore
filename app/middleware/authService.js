const jsonwebtoken = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");

function checkJwtHS256(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside checkJWTHS256`);

    const secretKey = process.env.AUTH_CLIENT_SECRET;
    const token = req?.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      token = req.cookies[process.env.AUTH_COOKIE_NAME]
    }
    return jsonwebtoken.verify(token, secretKey)
  } catch (error) {
    return res.status(500).json({ message: "Unauthorized-Invalid Token" })
  }
}
const isAdmin = (settingsConfig, req, res, next) => {
  try {
    const payload = checkJwtHS256(settingsConfig, req, res, next)
    if (!payload.isAdmin) {
      throw new Error("Not an Admin")
    }
    next()
  } catch (error) {
    return res.status(500).json(error)

  }
}
const isUser = (settingsConfig, req, res, next) => {
  try {
    const payload = checkJwtHS256(settingsConfig, req, res, next)
    if (payload.isAdmin) {
      throw new Error("Not an Admin")
    }
    next()
  } catch (error) {
    return res.status(500).json(error)

  }
}
module.exports = {
  checkJwtHS256,
  isAdmin,
  isUser
};
