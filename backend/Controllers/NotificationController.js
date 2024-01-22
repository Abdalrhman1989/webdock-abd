const { Notification } = require("../models");

const notificationController = {
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll();
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getUserNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: {
          userID: req.params.userID,
        },
      });
      await Notification.update(
        {
          isSeen: true,
        },
        { where: { userID: req.params.userID } }
      );
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },



  getNewNotificationsCount: async (req, res) => {
    try {
      const newNotificationsCount = await Notification.count({
        where: {
          userID: req.params.userID,
          isSeen : false
        },
      });
      res.json(newNotificationsCount);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return res.status(404).send("Notification not found");
      }
      res.json(notification);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const notificationId = req.params.id;

      // Attempt to delete the notification
      const deletedRowCount = await Notification.destroy({
        where: { id: notificationId },
      });

      // Check if the notification was found and deleted
      if (deletedRowCount === 0) {
        return res.status(404).send("Notification not found");
      }

      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

// Add other notification-related controller methods...

module.exports = notificationController;
