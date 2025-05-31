const bookConfig = require("../../../model-config/BookConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const db = require("../../../../models");
const { parseFilterQueries, parseLimitAndOffset, parseSelectFields } = require("../../../utils/request");
const errors = require("throw.js");

class BookService {
  constructor() {}

  // Create a new book
  async createBook(body) {
    const transaction = await startTransaction();
    try {
      const dbBook = await bookConfig.model.create(body, { transaction });
      await transaction.commit();
      console.log(dbBook);
      return dbBook;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get all books (with pagination + filters)
  async getBooks(settingsConfig, query) {
    const transaction = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[BookService] : Inside getBooks`);

      let selectArray = parseSelectFields(query, bookConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(bookConfig.fieldMapping);
      }

      const { count, rows } = await bookConfig.model.findAndCountAll({
        transaction,
        attributes: selectArray,
        ...parseFilterQueries(query, bookConfig.filters),
        ...parseLimitAndOffset(query),
      });

      await transaction.commit();
      return { count, rows };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get book by ID (with average rating, optional reviews)
  async getBookById(bookId) {
    const transaction = await startTransaction();
    try {
      const book = await bookConfig.model.findOne({
        where: { id: bookId },
        transaction,
        include: [
          {
            model: db.Review,
            as: 'reviews',
            attributes: ['id', 'user_id', 'rating', 'review_text', 'created_at'],
          }
        ],
      });

      if (!book) {
        throw new errors.NotFound('Book not found');
      }

      // Calculate average rating
      const averageRating = await db.Review.findOne({
        where: { book_id: bookId },
        attributes: [
          [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'average_rating']
        ],
        raw: true,
      });

      await transaction.commit();

      return {
        ...book.toJSON(),
        average_rating: parseFloat(averageRating.average_rating || 0).toFixed(2),
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = BookService;
