const express = require("express");
const router = express.Router();
const payrollController = require("../../controllers/payrollController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createPayrollSchemaValidation,
} = require("../../validations/payrollValidation");

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
 * /private/payroll:
 *   post:
 *     summary: Create Employee payroll
 *     description: |
 *
 *       **Rules:**
 *       - Once payroll is run, attendance, overtime, and reimbursement records from that period cannot affect the payslip.
 *       - Payroll for each attendance period can only be run once.
 *
 *       **Notes:**
 *       Admin will run payroll (process payments to employees).
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Payroll'
 *           examples:
 *              schema:
 *                  $ref: '#/components/schemas/Payroll'
 *     responses:
 *       200:
 *         description: Create Employee Payroll successfully
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
 *                   example: payroll for employee 1 created successfully
 *                 data:
 *                   $ref: '#/components/responses/Payroll'
 *       400:
 *         description: Bad Request
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
        body: createPayrollSchemaValidation,
    }),
    payrollController.createPayroll
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
 * /private/payroll:
 *   get:
 *     summary: List All Employee payroll
 *     description: |
 *       List all employee Payroll
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List all Employee Payroll
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
 *                   example: Payroll retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/Payroll'
 *       400:
 *         description: Bad Request
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

router.get("/", payrollController.getAllPayrolls);

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
 * /private/payroll/{payrollPeriodId}:
 *   get:
 *     summary: List payroll by payroll period id
 *     description: |
 *       List all payroll by payroll period id
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payrollPeriodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the attendance period
 *
 *     responses:
 *       200:
 *         description: List payroll by payroll period id
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
 *                   example: Payroll retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/Payroll'
 *       400:
 *         description: Bad Request
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
router.get("/:payrollPeriodId", payrollController.getAllPayrollsById);

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
 * /private/payroll/{month}/{year}:
 *   get:
 *     summary: List Employee payroll by month and year
 *     description: List all employee Payroll by month and year
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Month of the payroll
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year of the payroll
 *
 *     responses:
 *       200:
 *         description: List Employee Payroll by month and year
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
 *                   example: Payroll for period 2021/1 retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/Payroll'
 *       400:
 *         description: Bad Request
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
router.get("/:month/:year", payrollController.getAllPayrolls);

module.exports = router;
