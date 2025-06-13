const express = require("express");
const router = express.Router();
const attendancePeriodsController = require("../../controllers/attendancePeriodController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createAttendancePeriodSchemaValidation,
} = require("../../validations/attendanceValidation");

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
 * /private/attendance/periods:
 *   post:
 *     summary: Create Attendance period, run this endpoint in the SECOND STEP
 *     description: |
 *      Admin will create/view attendance period start & end date for all employees
 *     tags: [Attendance Period]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: date string format (YYYY-MM-DD)
 *                 example: 2025-06-01
 *               endDate:
 *                 type: date string format (YYYY-MM-DD)
 *                 example: 2025-06-30
 *     responses:
 *       200:
 *         description: Successful login
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
 *                   example: Attendance period created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: number
 *                      example: 1
 *                     payrollId:
 *                      type: number
 *                      example: null
 *                     userId:
 *                      type: number
 *                      example: 1
 *                     createdBy:
 *                      type: number
 *                      example: 1
 *                     updatedBy:
 *                      type: number
 *                      example: null
 *                     ipAddress:
 *                      type: string
 *                      example: 127.0.0.1
 *                     startDate:
 *                      type: string
 *                      example: 2025-06-01
 *                     endDate:
 *                      type: string
 *                      example: 2025-06-30
 *                     createdAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
 *                     updatedAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
 *       400:
 *         description: Overlap period
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
 *                   example: Overlap period
 *                 error:
 *                   type: string
 *                   example: Overlapping periods found
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
        body: createAttendancePeriodSchemaValidation,
    }),
    attendancePeriodsController.createAttendancePeriod
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
 * /private/attendance/periods:
 *   get:
 *     summary: List Attendance periods
 *     description: List all attendance periods for payroll
 *     tags: [Attendance Period]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful login
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
 *                   example: Attendance retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: number
 *                      example: 1
 *                     payrollId:
 *                      type: number
 *                      example: null
 *                     userId:
 *                      type: number
 *                      example: 1
 *                     createdBy:
 *                      type: number
 *                      example: 1
 *                     updatedBy:
 *                      type: number
 *                      example: null
 *                     ipAddress:
 *                      type: string
 *                      example: 127.0.0.1
 *                     startDate:
 *                      type: string
 *                      example: 2025-06-01
 *                     endDate:
 *                      type: string
 *                      example: 2025-06-30
 *                     createdAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
 *                     updatedAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
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

router.get("/", attendancePeriodsController.getAllAttendancePeriods);

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
 * /private/attendance/periods/{id}:
 *   get:
 *     summary: List Attendance period by specific id
 *     description: List attendance by specific id periods for payroll
 *     tags: [Attendance Period]
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
 *         description: Successful login
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
 *                   example: Attendance retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: number
 *                      example: 1
 *                     payrollId:
 *                      type: number
 *                      example: null
 *                     userId:
 *                      type: number
 *                      example: 1
 *                     createdBy:
 *                      type: number
 *                      example: 1
 *                     updatedBy:
 *                      type: number
 *                      example: null
 *                     ipAddress:
 *                      type: string
 *                      example: 127.0.0.1
 *                     startDate:
 *                      type: string
 *                      example: 2025-06-01
 *                     endDate:
 *                      type: string
 *                      example: 2025-06-30
 *                     createdAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
 *                     updatedAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
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
router.get("/:id", attendancePeriodsController.getAllAttendancePeriodsById);

module.exports = router;
