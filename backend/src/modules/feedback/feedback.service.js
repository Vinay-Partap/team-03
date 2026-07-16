const feedbackRepository = require("./feedback.repository");

class FeedbackService {
  async submitFeedback(feedbackData) {
    const { userId, name, email, subject, message, type } = feedbackData;
    if (!name || !email || !subject || !message) {
      throw new Error("Please fill all required fields");
    }

    return await feedbackRepository.create({
      userId,
      name,
      email,
      subject,
      message,
      type: type || "feedback",
    });
  }

  async getFeedbacks() {
    return await feedbackRepository.find();
  }

  async resolveFeedback(id) {
    const feedback = await feedbackRepository.findById(id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    feedback.status = "resolved";
    return await feedbackRepository.save(feedback);
  }
}

module.exports = new FeedbackService();
