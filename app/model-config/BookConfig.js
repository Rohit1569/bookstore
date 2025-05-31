const db = require("../../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;


class BookConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      title: "title",
      author: "author",
      genre: "genre",
      description: "description",
      publishedDate: "published_date",
      imageUrl: "image_url"
    });

    this.model = db.Book;
    this.modelName = db.Book.name;
    this.tableName = db.Book.tableName;

    this.filters = Object.freeze({
      id: (id) => {
        return {
          [this.fieldMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
      author: (author) => {

        return {
          [this.fieldMapping.author]: {
            [Op.iLike]: `%${author}%`,
          },
        };
      },
      genre: (genre) => {
    
        return {
          [this.fieldMapping.genre]: {
            [Op.iLike]: `%${genre}%`,
          },
        };
      },
      title: (title) => {
      
        return {
          [this.fieldMapping.title]: {
            [Op.iLike]: `%${title}%`,
          },
        };
      },
    });

    this.associations = Object.freeze({
    
    });
  }

  validate(book) {
    const { title, author, genre, description, publishedDate, imageUrl } = book;
    if (
      typeof title !== "string" ||
      typeof author !== "string" ||
      (genre && typeof genre !== "string") ||
      (description && typeof description !== "string") ||
      (publishedDate && isNaN(Date.parse(publishedDate))) ||
      (imageUrl && typeof imageUrl !== "string")
    ) {
      throw new Error("Invalid Book Parameters");
    }
  }
}

const bookConfig = new BookConfig();
module.exports = bookConfig;
