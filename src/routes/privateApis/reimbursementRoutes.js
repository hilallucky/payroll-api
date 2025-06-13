const express = require("express");
const router = express.Router();
const reimbursementController = require("../../controllers/reimbursementController");
const {
    createReimbursementSchemaValidation,
} = require("../../validations/reimbursementValidation");
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
 * /private/reimbursement:
 *   post:
 *     summary: Create Employee reimbursement Submission
 *     description: |
 *       Endpoint where employees can submit reimbursements.
 *
 *       **Rules:**
 *       - Employees can attach the amount of money that needs to be reimbursed.
 *       - Employees can attach a description to that reimbursement.
 *     tags: [Reimbursement]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Reimbursement'
 *           examples:
 *              schema:
 *                  $ref: '#/components/schemas/Reimbursement'
 *     responses:
 *       200:
 *         description: Create Employee Reimbursement successfully
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
 *                   example: reimbursement for employee 1 created successfully
 *                 data:
 *                   $ref: '#/components/responses/Reimbursement'
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
        body: createReimbursementSchemaValidation,
    }),
    reimbursementController.createReimbursement
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
 * /private/reimbursement:
 *   get:
 *     summary: List Employee Reimbursement Submission
 *     description: |
 *       Endpoint List all employee Reimbursement.
 *     tags: [Reimbursement]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List all Employee reimbursement successfully
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
 *                   example: Employees reimbursement retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/responses/Reimbursement'
 *       400:
 *         description: Failed to retrieve reimbursement
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
 *                   example: Failed to retrieve reimbursement
 *                 error:
 *                   type: string
 *                   example: Failed to retrieve reimbursement
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

router.get("/", reimbursementController.getAllReimbursement);

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
 * /private/reimbursement/{id}:
 *   get:
 *     summary: List Employee Reimbursement for specific id Submission
 *     description: |
 *       Endpoint List employee Reimbursement for specific id.
 *     tags: [Reimbursement]
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
 *         description: List Employee reimbursement for specific id successfully
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
 *                   example: Employee reimbursement retrieved successfully
 *                 data:
 *                   type: object
 *                   items:
 *                      $ref: '#/components/responses/Reimbursement'
 *       400:
 *         description: Failed to retrieve reimbursement
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
 *                   example: Failed to retrieve reimbursement
 *                 error:
 *                   type: string
 *                   example: Failed to retrieve reimbursement
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

router.get("/:id", reimbursementController.getAllReimbursementByEmployeeId);

module.exports = router;
