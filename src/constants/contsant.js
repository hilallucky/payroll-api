const statusCodes = {
    NOT_FOUND: 404,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    SERVER_ISSUE: 500,
    PERMISSION_DENIED: 403,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    NEW_RESOURCE: 201,
};

const attendanceType = {
    LEAVE: "LEAVE",
    CHECKIN: "CHECKIN",
    CHECKOUT: "CHECKOUT",
    OVERTIMEIN: "OVERTIMEIN",
    OVERTIMEOUT: "OVERTIMEOUT",
    UNPAIDLEAVE: "UNPAIDLEAVE",
};

const approvalStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
};

const payrollStatus = {
    PAYROLLED: "PAYROLLED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
};

const payslipStatus = {
    PAYSLIPED: "PAYSLIPED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
};

module.exports = {
    statusCodes,
    attendanceType,
    approvalStatus,
    payrollStatus,
    payslipStatus,
};
