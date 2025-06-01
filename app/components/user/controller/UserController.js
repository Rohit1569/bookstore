const { StatusCodes } = require("http-status-codes")
const UserService = require("../service/UserService");
const { UUIDV4 } = require("sequelize");
const { v4 } = require("uuid");
const errors = require("throw.js")



class UserController {
  constructor() {
    this.userService = new UserService()
  }

  async login(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserController] : Inside login`);
  
      const { username, password } = req.body;
      const token = await this.userService.authenticateUser(settingsConfig, username, password);
  
      
      res.cookie(process.env.AUTH_COOKIE_NAME, token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'local',
        sameSite: 'lax', 
        maxAge: 60 * 60 * 1000, 
      });
  
     
      res.status(StatusCodes.OK).json({ message: "Login Done", token });
    } catch (error) {
      next(error);
    }
  }
  
  async logout(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserController] : Inside logout`);

      res.cookie(process.env.AUTH_COOKIE_NAME, "", { expires: new Date(Date.now()) });
      res.status(StatusCodes.OK).json("Logged out")
    } catch (error) {
      next(error)
    }
  }

  async getAllUsers(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserController] : Inside getAllUsers`);
      const query = req.query
      const { count, rows } = await this.userService.getAllUsers(settingsConfig, query)
      res.set('Total-X-Count', count)
      res.status(StatusCodes.ACCEPTED).json({ rows })
    } catch (error) {
      next(error)
    }
  }

  async add(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger
      logger.info(`[ADD_CONTROLLER] :: START : Inside add controller`);

      let body = (req.body)
      body.id = v4()
      const user = await this.userService.getUserByUsername(settingsConfig, req.body.username)
      if (user.length != 0) {
        throw new errors.BadRequest("User already exists.");
      }
      const newbody = await this.userService.createUser(body)
      logger.info(`[add] :: END : End of add controller`);
      console.log(body);
      return res.status(StatusCodes.CREATED).json(newbody)
    } catch (error) {
      next(error)
    }
  }

  async getOne(settingsConfig, req, res, next) {
    const logger = settingsConfig.logger;
    logger.info(`[USER_CONTROLLER] :: START : Inside User getOne Controller`);
    try {
      const userId = req.params.userId


      const user = await this.userService.getOne(userId, req.query)
      return res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(settingsConfig, req, res, next) {
    const logger = settingsConfig.logger;
    logger.info(`[USER_CONTROLLER] :: START : Inside Delete User Controller`);
    try {
      const userId = req.params.userId


      const user = await this.userService.deleteUserByid(userId)
      return res.status(StatusCodes.OK).json("User Deleted")
    } catch (error) {
      next(error)
    }
  }

  async updateUser(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger
      logger.info(`User_CONTROLLER] :: START : Inside update controller`);

      let body = (req.body)
      const userId = req.params.userId
      const user = await this.userService.getOne(settingsConfig, userId, req.query)
      if (user.length == 0) {
        throw new errors.BadRequest("User not found")
      }

      const [userUpdated] = await this.userService.updateUser(settingsConfig, userId, req.body)
      if (userUpdated == 0) {
        throw new errors.BadRequest("Could not update")
      }

      await this.userService.update(body, userId)
      logger.info(`[User_CONTROLLER] :: END : End of update controller`);
      return res.status(StatusCodes.ACCEPTED).json(null)
    } catch (error) {
      next(error)
    }
  }







}

module.exports = new UserController()