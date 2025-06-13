require("dotenv").config();

process.env.TZ = "Asia/Jakarta";

const date = new Date();

const jakartaFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
});

console.log("Current time in Jakarta:", jakartaFormatter.format(date));

const logger = require("morgan");
const bodyParser = require("body-parser");

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const router = express.Router();

const authRoutes = require("./routes/publicApis/authRoutes");
const employeeRoutes = require("./routes/privateApis/employeeRoutes");
const attendancePeriodRoutes = require("./routes/privateApis/attendancePeriodRoutes");
const attendanceRoutes = require("./routes/privateApis/attendanceRoutes");
const overtimeRoutes = require("./routes/privateApis/overtimeRoutes");
const reimbursementRoutes = require("./routes/privateApis/reimbursementRoutes");
const payrollRoutes = require("./routes/privateApis/payrollRoutes");
const payslipRoutes = require("./routes/privateApis/payslipRoutes");

const authenticateToken = require("./middlewares/authMiddleware");

const requestIdMiddleware = require("./middlewares/requestIdMiddleware");
const performanceLogger = require("./loggers/performanceLogger");
const auditInfo = require("./loggers/auditInfo");

// app.use(express.json());
app.use(bodyParser.json());
app.use(logger("dev"));

app.use(requestIdMiddleware);
app.use(performanceLogger);
app.use(auditInfo);

require("./swagger/swagger")(app);

app.use("/api/v1.0", router);

router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Payroll API" });
});

// Public routes
app.use("/api/v1.0/public", authRoutes);

// Protected routes with JWT middleware
app.use("/api/v1.0/private/employees", authenticateToken, employeeRoutes);
app.use(
    "/api/v1.0/private/attendance/periods",
    authenticateToken,
    attendancePeriodRoutes
);
app.use("/api/v1.0/private/attendance", authenticateToken, attendanceRoutes);
app.use("/api/v1.0/private/overtime", authenticateToken, overtimeRoutes);
app.use(
    "/api/v1.0/private/reimbursement",
    authenticateToken,
    reimbursementRoutes
);
app.use("/api/v1.0/private/payroll", authenticateToken, payrollRoutes);
app.use("/api/v1.0/private/payslip", authenticateToken, payslipRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(
        `Payroll API docs available at http://localhost:${port}/api-docs`
    );
});

module.exports = app;
