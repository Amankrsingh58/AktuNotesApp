const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ adminId, action, details, targetId, targetModel, ipAddress }) => {
    try {
        await ActivityLog.create({
            admin: adminId,
            action,
            details,
            targetId,
            targetModel,
            ipAddress
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

module.exports = logActivity;
