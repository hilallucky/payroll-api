const { statusCodes } = require("../constants/contsant");

const successResponse = (
    res,
    message,
    data = null,
    code = statusCodes.SUCCESS
) => {
    return res.status(code).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (
    res,
    message,
    error = null,
    code = statusCodes.SERVER_ISSUE
) => {
    return res.status(code).json({
        success: false,
        message,
        error,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};
