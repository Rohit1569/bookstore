const { StatusCodes } = require("http-status-codes");
const BookService = require("../service/BookService");
const { v4 } = require("uuid");
const errors = require("throw.js");

class BookController {
  constructor() {
    this.bookService = new BookService();
  }

  // Add a new book
  async addBook(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[BOOK_CONTROLLER] :: START : Inside addBook controller`);

      let body = req.body;
      body.id = v4();

      const newBook = await this.bookService.createBook(body);
      logger.info(`[BOOK_CONTROLLER] :: END : End of addBook controller`);
      return res.status(StatusCodes.CREATED).json(newBook);
    } catch (error) {
      next(error);
    }
  }

  // Get all books 
  async getAllBooks(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[BOOK_CONTROLLER] :: START : Inside getAllBooks controller`);

      const query = req.query;
      const { count, rows } = await this.bookService.getBooks(settingsConfig, query);
      res.set("Total-X-Count", count);
      return res.status(StatusCodes.OK).json({ rows });
    } catch (error) {
      next(error);
    }
  }

  // Get a book by ID
  async getBookById(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[BOOK_CONTROLLER] :: START : Inside getBookById controller`);

      const bookId = req.params.bookId;
      const book = await this.bookService.getBookById(bookId);
      if (!book) {
        throw new errors.NotFound("Book not found");
      }

      return res.status(StatusCodes.OK).json(book);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
