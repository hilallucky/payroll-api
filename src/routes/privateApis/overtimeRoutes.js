const express = require("express");
const router = express.Router();
const overtimeController = require("../../controllers/overtimeController");
const {
    createOvertimeSchemaValidation,
} = require("../../validations/overtimeValidation");
const { validateRequest } = require("../../middlewares/validationRequest");

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *
 * @swagger
 * /private/overtime:
 *   post:
 *     summary: Create Employee Overtime Submission
 *     description: |
 *       Endpoint where employees can submit overtime.
 *
 *       **Rules:**
 *       - Overtime must be proposed after they are done working.
 *       - They can submit the number of hours taken for that overtime.
 *       - Overtime cannot be more than 3 hours per day.
 *       - Overtime can be taken any day.
 *
 *       **Notes:**
 *       - Employee overtime proposal
 *       - Employee can submit overtime after they are done working
 *     tags: [Overtime]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/OvertimeV2'
 *               - $ref: '#/components/schemas/OvertimeV1'
 *           examples:
 *             OvertimeV1:
 *               $ref: '#/components/schemas/OvertimeV1'
 *             OvertimeV2:
 *               $ref: '#/components/schemas/OvertimeV2'
 *     responses:
 *       200:
 *         description: Create Employee Attendance successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Overtime for employee 1 created successfully
 *                 data:
 *                   $ref: '#/components/responses/Overtime'
 *       400:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/responses/errorRequestBody'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server Error
 *                 error:
 *                   type: string
 *                   example: Server Error
 */

router.post(
    "/",
    validateRequest({
        body: createOvertimeSchemaValidation,
    }),
    overtimeController.createOvertime
);

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *
 * @swagger
 * /private/overtime:
 *   get:
 *     summary: List Employee Overtime Submission
 *     description: |
 *       Endpoint List all employee overtime.
 *     tags: [Overtime]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List all Employee Overtime successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Employees overtime retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/responses/Overtime'
 *       400:
 *         description: Failed to retrieve overtime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve overtime
 *                 error:
 *                   type: string
 *                   example: Failed to retrieve overtime
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server Error
 *                 error:
 *                   type: string
 *                   example: Server Error
 */

router.get("/", overtimeController.getAllOvertime);

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *
 * @swagger
 * /private/overtime/{id}:
 *   get:
 *     summary: List Employee by specific id Overtime Submission
 *     description: |
 *       Endpoint List overtime for specific id can submit overtime.
 *     tags: [Overtime]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the attendance period
 *     responses:
 *       200:
 *         description: List Employee Overtime for specific id successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Employees overtime retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/Overtime'
 *       400:
 *         description: Failed to retrieve overtime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve overtime
 *                 error:
 *                   type: string
 *                   example: Failed to retrieve overtime
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server Error
 *                 error:
 *                   type: string
 *                   example: Server Error
 */

router.get("/:id", overtimeController.getAllOvertimeByEmployeeId);

module.exports = router;
