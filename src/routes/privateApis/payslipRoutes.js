const express = require("express");
const router = express.Router();
const payslipsController = require("../../controllers/payslipController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createPayslipByIdSchemaValidation,
    createAllPayslipSchemaValidation,
    createSummPayslipSchemaValidation,
} = require("../../validations/payslipValidation");

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
 * /private/payslip/periods:
 *   get:
 *     summary: List all available payslip periods
 *     description: List all available payslip periods
 *     tags: [Payslip]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List all available payslip periods
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
 *                   example: Payslip period retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/PayslipPeriods'
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

router.get(
    "/periods",
    validateRequest({ query: createSummPayslipSchemaValidation }),
    payslipsController.getAllPayrollPeriod
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
 * /private/payslip:
 *   get:
 *     summary: Generate payslip
 *     description: |
 *       Generate payslip can add parameters to filter by employee id, month (M) and year (YYYY)
 *     tags: [Payslip]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *           format: int64
 *           example: 1
 *         description: Employee ID to filter by
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           format: int64
 *           example: 1
 *         description: Filter by month (M)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           format: int64
 *           example: "2025"
 *         description: Filter by year (YYYY)
 *     responses:
 *       200:
 *         description: Generate Employee Payslip by id
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
 *                   example: Payslip generated successfully
 *                 data:
 *                   items:
 *                      $ref: '#/components/responses/Payslip'
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

router.get(
    "/",
    validateRequest({ query: createPayslipByIdSchemaValidation }),
    payslipsController.generatePayslipById
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
 * /private/payslip/summary:
 *   get:
 *     summary: List payslip
 *     description: |
 *       List all payslip
 *     tags: [Payslip]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           format: int64
 *           example: 1
 *         description: Filter by month (M)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           format: int64
 *           example: "2025"
 *         description: Filter by year (YYYY)
 *     responses:
 *       200:
 *         description: List Employee Payslip by id
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
 *                   example: Payslip summary retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/PayslipSummary'
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

router.get(
    "/summary",
    validateRequest({ query: createAllPayslipSchemaValidation }),
    payslipsController.generateSummaryPayslip
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
 * /private/payslip/period/summary:
 *   get:
 *     summary: List payslip
 *     description: |
 *       List all payslip
 *     tags: [Payslip]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *           format: int64
 *           example: 1
 *         description: Filter by month (M)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           format: int64
 *           example: 1
 *         description: Filter by month (M)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           format: int64
 *           example: "2025"
 *         description: Filter by year (YYYY)
 *     responses:
 *       200:
 *         description: List Employee Payslip by id
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
 *                   example: Payslip retrieved successfully
 *                 data:
 *                   $ref: '#/components/responses/Payslip'
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

router.get(
    "/period/summary",
    validateRequest({ query: createSummPayslipSchemaValidation }),
    payslipsController.getAllPayrollPeriod
);

module.exports = router;
