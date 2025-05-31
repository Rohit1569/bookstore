const reviewConfig = require("../../../model-config/ReviewConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const errors = require("throw.js");

class ReviewService {
  constructor() {}

  // Create (submit) a new review
  async submitReview(userId, bookId, body) {
    const transaction = await startTransaction();
    try {
      const existing = await reviewConfig.model.findOne({
        where: { userId, bookId },
        transaction,
      });
      if (existing) {
        throw new errors.BadRequest("You have already submitted a review for this book.");
      }

      body.userId = userId;
      body.bookId = bookId;
      const review = await reviewConfig.model.create(body, { transaction });

      await transaction.commit();
      return review;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Update your own review
  async updateReview(userId, reviewId, body) {
    const transaction = await startTransaction();
    try {
      const review = await reviewConfig.model.findOne({
        where: { id: reviewId, userId },
        transaction,
      });
      if (!review) {
        throw new errors.NotFound("Review not found or you are not the owner.");
      }

      await review.update(body, { transaction });
      await transaction.commit();
      return review;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Delete your own review
  async deleteReview(userId, reviewId) {
    const transaction = await startTransaction();
    try {
      const deleted = await reviewConfig.model.destroy({
        where: { id: reviewId, userId },
        transaction,
      });
      if (!deleted) {
        throw new errors.NotFound("Review not found or you are not the owner.");
      }
      await transaction.commit();
      return "Review deleted.";
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = ReviewService;
