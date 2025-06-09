const { AuditLog } = require("../models");

const logChange = async ({
    table,
    recordId,
    operation,
    changes,
    userId,
    ipAddress,
    requestId,
}) => {
    return AuditLog.create({
        table_name: table,
        record_id: recordId,
        operation,
        changes,
        user_id: userId,
        ip_address: ipAddress,
        request_id: requestId,
    });
};

module.exports = { logChange };
