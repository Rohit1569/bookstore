const userConfig = require("../../../model-config/UserConfig");
// const accountConfig = require("../../../model-config/AccountConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const db = require("../../../../models")
// const { preloadAssociations } = require("../../../sequelize/association")
const { parseFilterQueries, parseLimitAndOffset, parseSelectFields } = require("../../../utils/request");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const errors = require("throw.js");

class UserService {
  constructor() { }

  // #assosiationMap = {
  //   account: {
  //     model: accountConfig.model,
  //     as: 'account',
  //   }

  // }

  // #createAssociations(includeQuery, selectArray) {
  //   const associations = []

  //   if (!Array.isArray(includeQuery)) {
  //     includeQuery = [includeQuery]
  //   }

  //   if (includeQuery?.includes(userConfig.associations.userAccountFilter)) {

  //     associations.push(this.#assosiationMap.account)
  //   }

  //   return associations
  // }


  // //getAllUser
  async getAllUsers(settingsConfig, query) {
    const t = await startTransaction()
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside getAllUsers`);
      let selectArray = parseSelectFields(query, userConfig.fieldMapping)
      if (!selectArray) {
        selectArray = Object.values(userConfig.fieldMapping)
      }

      const includeQuery = query.include || []
      let associations = []
      if (query.include) {
        delete query.include
      }

      // if (includeQuery?.length > 0) {
      //   associations = this.#createAssociations(includeQuery, selectArray)
      // }
      const { count, rows } = await userConfig.model.findAndCountAll({
        transaction: t,
        attributes: selectArray,
        ...parseFilterQueries(query, userConfig.associations.userAccountFilter),
      });

      t.commit()
      return { count, rows }
    } catch (error) {
      t.rollback()
      throw error
    }
  }

  //create user
  async createUser(body) {
    const transaction = await startTransaction()
    try {
      let hashedPassword = await bcrypt.hash(body.password, 12)
      body.password = hashedPassword
      const dbUser = await userConfig.model.create(body, { transaction })
      await transaction.commit()
      console.log(dbUser);
      return dbUser

    }
    catch (error) {
      await transaction.rollback()
      throw error
    }
  }


  //getuserbyid
  // async getOne(userId, query) {
  //   const transaction = await startTransaction();
  //   try {
  //     let selectArray = parseSelectFields(query, userConfig.fieldMapping)
  //     if (!selectArray) {
  //       selectArray = Object.values(userConfig.fieldMapping)
  //     }

  //     const includeQuery = query.include || []
  //     let associations = []
  //     if (query.include) {
  //       delete query.include
  //     }

  //     if (includeQuery?.length > 0) {
  //       associations = this.#createAssociations(includeQuery, selectArray)
  //     }
  //     const user = await userConfig.model.findOne({
  //       id: userId,
  //       transaction,
  //       ...parseFilterQueries(query, userConfig.associations.userAccountFilter),
  //       ...preloadAssociations(associations),
  //       ...parseLimitAndOffset(query)
  //     });
  //     await transaction.commit();
  //     return user;
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // }


  //delete user
  async deleteUserByid(userId) {
    const transaction = await startTransaction();
    try {
      const deleteUserBymyid = await userConfig.model.destroy({
        where: {
          id: userId
        }
      }, transaction)
      await transaction.commit();
      return "deleted"
    }
    catch (error) {
      await transaction.rollback();
      throw (error)
    }
  }


  //update user
  async update(body, userId) {
    const transaction = await startTransaction()
    try {
      await userConfig.model.update(body, {
        where: {
          id: userId
        }
      }, transaction)

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }


  async getUserByUsername(settingsConfig, username) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside getUserByUsername`);

      const data = await userConfig.model.findAll({
        transaction: t,
        where: { username: username },
      });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async authenticateUser(settingsConfig, username, password) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside authenticateUser`);

      let [myUser] = await this.getUserByUsername(settingsConfig, username);
      if (myUser == undefined) {
        throw new errors.BadRequest("Invalid username")
      }

      let check = await bcrypt.compare(password, myUser.dataValues.password);
      if (!check) {
        throw new errors.BadRequest("Invalid password.")
      }

      let myobj = {
        userId: myUser.dataValues.id,
        username: myUser.dataValues.username,
        isAdmin: myUser.dataValues.isAdmin,
      };
      console.log(process.env.JWT_SECRET_KEY,"process.env.JWT_SECRET_KEY");
      
      let token = jwt.sign(myobj, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60,
      });

      return token;
    } catch (error) {
      console.log("error",error);
      
      throw error;
    }
  }


}
module.exports = UserService