const Feedback = require("./feedback.model");

class FeedbackRepository {
  async create(feedbackData) {
    return await Feedback.create(feedbackData);
  }

  async find() {
    return await Feedback.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Feedback.findById(id);
  }

  async save(feedback) {
    return await feedback.save();
  }
}

module.exports = new FeedbackRepository();
