const { StatusCodes } = require("http-status-codes");
const ReviewService = require("../service/ReviewService");

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  async submitReview(settingsConfig, req, res, next) {
    try {
      const userId = req.body.userId
      const bookId = req.params.id;
      const body = req.body;

      const review = await this.reviewService.submitReview(userId, bookId, body);
      return res.status(StatusCodes.CREATED).json(review);
    } catch (error) {
      next(error);
    }
  }

  async updateReview(settingsConfig, req, res, next) {
    try {
      const userId = req.auth.userId;
      const reviewId = req.params.id;
      const body = req.body;

      const updated = await this.reviewService.updateReview(userId, reviewId, body);
      return res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(settingsConfig, req, res, next) {
    try {
      const userId = req.auth.userId;
      const reviewId = req.params.id;

      const message = await this.reviewService.deleteReview(userId, reviewId);
      return res.status(StatusCodes.OK).json({ message });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
