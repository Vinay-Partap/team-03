const Notification = require("./notifications.model");

class NotificationsRepository {
  async findByUserOrGlobal(userId) {
    return await Notification.find({
      $or: [{ userId }, { userId: null }],
    }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Notification.findById(id);
  }

  async save(notification) {
    return await notification.save();
  }
}

module.exports = new NotificationsRepository();
