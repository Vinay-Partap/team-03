const notificationsRepository = require("./notifications.repository");

class NotificationsService {
  async getNotifications(userId) {
    return await notificationsRepository.findByUserOrGlobal(userId);
  }

  async markAsRead(id) {
    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.read = true;
    return await notificationsRepository.save(notification);
  }
}

module.exports = new NotificationsService();
