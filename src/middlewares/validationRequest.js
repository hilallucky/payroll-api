const { statusCodes } = require("../constants/contsant");
const { errorResponse } = require("../utils/baseResponse");

exports.validateRequest = (schemas) => {
    return (req, res, next) => {
        const validationErrors = [];

        for (const [target, schema] of Object.entries(schemas)) {
            if (schema) {
                const { error } = schema.validate(req[target], {
                    abortEarly: false,
                    errors: { wrap: { label: "" } },
                });

                if (error) {
                    validationErrors.push(
                        ...error.details.map((detail) => ({
                            object:
                                detail.context?.label || detail.path.join("."),
                            message: detail.message,
                        }))
                    );
                }
            }
        }

        if (validationErrors.length > 0)
            return errorResponse(
                res,
                "Validation Error",
                { data: validationErrors },
                statusCodes.BAD_REQUEST
            );

        next();
    };
};
