const jsonwebtoken = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

function checkJwtHS256(settingsConfig, req, res, next) {
  const logger = settingsConfig.logger;
  try {
    logger.info(`[AUTH_SERVICE] : Inside checkJWTHS256`);

    let token = req.headers["authorization"]?.replace("Bearer ", "");
    logger.info(`[AUTH_SERVICE] : Token from header: ${token}`);

    if (!token && req.cookies) {
      token = req.cookies[process.env.AUTH_COOKIE_NAME];
      logger.info(`[AUTH_SERVICE] : Token from cookie: ${token}`);
    }

    if (!token) {
      logger.warn(`[AUTH_SERVICE] : No token found in request`);
      throw new Error("No token provided");
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    logger.info(`[AUTH_SERVICE] : Verifying token with secret`);

    const payload = jsonwebtoken.verify(token, secretKey);
    logger.info(`[AUTH_SERVICE] : Token verified successfully. Payload: ${JSON.stringify(payload)}`);

    return payload;
  } catch (error) {
    logger.error(`[AUTH_SERVICE] : JWT verification failed: ${error.message}`);
    throw new Error("Unauthorized - Invalid Token");
  }
}

const isAuthenticated = (settingsConfig, req, res, next) => {
  try {
    const payload = checkJwtHS256(settingsConfig, req, res, next);
    req.user = payload; // attach payload for controller use
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

module.exports = {
  checkJwtHS256,
  isAuthenticated,
};
