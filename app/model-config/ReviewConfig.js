const db = require("../../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

class ReviewConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      userId: "user_id",
      bookId: "book_id",
      rating: "rating",
      reviewText: "review_text",
      createdAt: "created_at"
    });

    this.model = db.Review;
    this.modelName = db.Review.name;
    this.tableName = db.Review.tableName;

    this.filters = Object.freeze({
      id: (id) => {
      
        return {
          [this.fieldMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
      userId: (userId) => {

        return {
          [this.fieldMapping.userId]: {
            [Op.eq]: userId,
          },
        };
      },
      bookId: (bookId) => {
     
        return {
          [this.fieldMapping.bookId]: {
            [Op.eq]: bookId,
          },
        };
      },
      rating: (rating) => {
      
        return {
          [this.fieldMapping.rating]: {
            [Op.eq]: rating,
          },
        };
      }
    });

    this.associations = Object.freeze({
      reviewUserFilter: "reviewUserFilter",
      reviewBookFilter: "reviewBookFilter"
    });
  }

  validate(review) {
    const { userId, bookId, rating, reviewText } = review;
    if (!userId || !bookId) {
      throw new Error("userId and bookId are required.");
    }
    if (typeof reviewText !== "string") {
      throw new Error("reviewText must be a string.");
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw new Error("rating must be a number between 1 and 5.");
    }
  }
}

const reviewConfig = new ReviewConfig();
module.exports = reviewConfig;
