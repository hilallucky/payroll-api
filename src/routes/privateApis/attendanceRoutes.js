const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/attendanceController");
const {
    createAttendanceSchemaValidation,
} = require("../../validations/attendanceValidation");
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
 * /private/attendance:
 *   post:
 *     summary: Create Employee Attendance, and run this endpoint at the FOURTH STEP
 *     description: |
 *       Endpoint where employees can submit their own attendance.
 *
 *       **<span style="color:red">Rules:</span>**
 *       - No rules for late or early check-ins or check-outs; check-in at any time that day counts.
 *       - Submissions on the same day should count as one.
 *       - Users cannot submit on weekends.
 *
 *       **<span style="color:blue">Notes:</span>**
 *       - If the employee is not found, the attendance record will not be created.
 *       - Employee attendance data record for **CHECKIN**, **CHECKOUT**, **LEAVE**, **OVERTIMEIN**, **OVERTIMEOUT**
 *       - When attendance record type is **CHECKOUT** then system will calculate work hours
 *       - When attendance record type is **OVERTIMEOUT** then system will calculate overtime hours
 *       - Attendance record type **OVERTIMEIN** will allowed only to employee who finish their working hours AND already propose to OVERTIME using endpoint /private/overtime
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - attendanceDate
 *               - attendanceType
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *               attendanceDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-06-01 12:00:00
 *                 description: attendanceDate (optional), if not provided, the current date and time will be used
 *                 nullable: true
 *               attendanceType:
 *                 type: string
 *                 enum: [CHECKIN,CHECKOUT,LEAVE,OVERTIMEIN,OVERTIMEOUT,UNPAIDLEAVE]
 *                 example: CHECKIN
 *                 description:
 *                   possible values:
 *                   - CHECKIN
 *                   - CHECKOUT
 *                   - LEAVE
 *                   - OVERTIMEIN
 *                   - OVERTIMEOUT
 *                   - UNPAIDLEAVE
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
 *                   example: Attendance for employee 1 created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: number
 *                      example: 1
 *                     workHours:
 *                      type: string
 *                      example: 00:00:00
 *                     overtimeHours:
 *                      type: string
 *                      example: 00:00:00
 *                     userId:
 *                      type: number
 *                      example: 1
 *                     ipAddress:
 *                      type: string
 *                      example: 127.0.0.1
 *                     createdBy:
 *                      type: number
 *                      example: 1
 *                     createdAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
 *                     updatedAt:
 *                      type: string
 *                      example: 2023-06-01 12:00:00
 *                     updatedBy:
 *                      type: number
 *                      example: null
 *       400:
 *         description: Validation Error
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
 *                   example: Validation Error
 *                 error:
 *                   type: object
 *                   properties:
 *                     data:
 *                      type: array
 *                      example: [ { "object": "attendanceType", "message": "attendanceType must be one of [LEAVE, CHECKIN, CHECKOUT, OVERTIMEIN, OVERTIMEOUT, UNPAIDLEAVE"} ]
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
        body: createAttendanceSchemaValidation,
    }),
    attendanceController.createAttendance
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
 * /private/attendance:
 *   get:
 *     summary: List All Employee Attendance
 *     description: |
 *       List attendance for all employees.
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List attendance for all employees successfully
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
 *                   example: Employees attendance retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/responses/Attendance'
 *
 *       400:
 *         description: Validation Error
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
 *                   example: Validation Error
 *                 error:
 *                   type: object
 *                   properties:
 *                     data:
 *                      type: string
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

router.get("/", attendanceController.getAllAttendance);

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
 * /private/attendance/{id}:
 *   get:
 *     summary: List Attendance by specific id
 *     description: |
 *       List attendance for specific id.
 *     tags: [Attendance]
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
 *         description: List attendance for specific id successfully
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
 *                   example: Employees attendance retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/responses/Attendance'
 *
 *       400:
 *         description: Validation Error
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
 *                   example: Validation Error
 *                 error:
 *                   type: object
 *                   properties:
 *                     data:
 *                      type: string
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

router.get("/:id", attendanceController.getAllAttendanceByEmployeeId);

module.exports = router;
