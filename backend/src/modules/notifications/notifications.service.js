const notificationsRepository = require("./notifications.repository");

class NotificationsService {
  async getNotifications(userId, page, limit) {
    return await notificationsRepository.findByUserOrGlobal(userId, page, limit);
  }

  async markAsRead(id, userId) {
    const notification = await notificationsRepository.findById(id);
    if (!notification || (notification.userId && notification.userId.toString() !== userId.toString())) {
      throw new Error("Notification not found");
    }

    notification.read = true;
    return await notificationsRepository.save(notification);
  }
  async markAllRead(userId) { return notificationsRepository.markAllRead(userId); }
  async deleteNotification(id, userId) { const n = await notificationsRepository.findById(id); if (!n || (n.userId && n.userId.toString() !== userId.toString())) throw new Error("Notification not found"); return notificationsRepository.delete(id); }
}

module.exports = new NotificationsService();
