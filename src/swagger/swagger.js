const expressListEndpoints = require("express-list-endpoints");
require("dotenv").config();

// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Import all tag definitions
require("./tags/allTags");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Payroll API Documentation",
            version: "1.0.0",
            description: "API documentation for Payroll application",
            contact: {
                name: "Your Name/Company",
                url: "http://your-company.com",
                email: "support@your-company.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.port || 3000}/api/v1.0`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                        'Enter the JWT token in the format "Bearer <token>"',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    // Paths to files containing OpenAPI definitions
    apis: [
        "./src/routes/**/*.js",
        "./src/swagger/schemas/*.yml",
        "./src/swagger/tags/*.js",
        // path.join(__dirname, "./src/swagger/schemas/*.yml"),
        "./src/controllers/*.js",
    ],
};

const specs = swaggerJsdoc(options);

autoGeneratePaths = (app) => {
    const endpoints = expressListEndpoints(app);
    // Generate basic paths for all endpoints
    endpoints.forEach((endpoint) => {
        // Add to your swagger spec
    });
};

module.exports = (app) => {
    // Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    // API docs in JSON format
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    });
};
