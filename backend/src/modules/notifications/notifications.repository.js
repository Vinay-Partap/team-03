const Notification = require("./notifications.model");

class NotificationsRepository {
  async findByUserOrGlobal(userId, page = 1, limit = 20) {
    return await Notification.find({
      $or: [{ userId }, { userId: null }],
    }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  }

  async findById(id) {
    return await Notification.findById(id);
  }

  async markAllRead(userId) { return Notification.updateMany({ $or: [{ userId }, { userId: null }], read: false }, { read: true }); }

  async delete(id) { return Notification.findByIdAndDelete(id); }

  async save(notification) {
    return await notification.save();
  }
}

module.exports = new NotificationsRepository();
