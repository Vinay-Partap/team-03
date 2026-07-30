const notificationsService = require("./notifications.service");

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user.id, Number(req.query.page) || 1, Math.min(Number(req.query.limit) || 20, 50));
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationsService.markAsRead(id, req.user.id);
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllRead = async (req, res) => { try { await notificationsService.markAllRead(req.user.id); res.json({ success: true }); } catch (e) { res.status(500).json({ success:false, message:e.message }); } };
const deleteNotification = async (req, res) => { try { await notificationsService.deleteNotification(req.params.id, req.user.id); res.json({ success:true }); } catch (e) { res.status(404).json({ success:false, message:e.message }); } };
module.exports = { getNotifications, markAsRead, markAllRead, deleteNotification };
