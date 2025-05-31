const db = require("../../models");

class UserConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      name: "name",
      age: "age",
      gender: "gender",
      username: "username",
      password: "password",
      isAdmin: "isAdmin",
    });
    // this.associations = Object.freeze({
    //   contactFilter: 'contactFilter',
    // })
    this.model = db.user;
    this.modelName = db.user.name;
    this.tableName = db.user.tableName;
    this.filters = Object.freeze({
      email: (email) => {
        validateStringLength(email, "email", undefined, 255);
        return Sequelize.where(
          Sequelize.fn("lower", Sequelize.col(this.columnMapping.email)),
          { [Op.eq]: `${email.toLowerCase()}` }
        );
      },
      id: (id) => {
        validateUuid(id, "user config");
        return {
          [this.fieldMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
      username: (username) => {
        validateStringLength(username, "username", undefined, 255);
        return {
          [this.fieldMapping.username]: {
            [Op.eq]: username,
          },
        };
      },
    });
    this.associations = Object.freeze({
      userAccountFilter: 'userAccountFilter'
    })
  }

  validate(user) {
    const { name, age, gender, username, password, isAdmin } = user;
    if (
      typeof name != "string" ||
      typeof age != "integer" ||
      typeof gender != "string" ||
      typeof username != "string" ||
      typeof password != "string" ||
      typeof isAdmin != "boolean"
    ) {
      throw new Error("Invalid Parameter");
    }

  }

}
const userConfig = new UserConfig();
module.exports = userConfig;
