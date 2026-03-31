import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "obstetric-care-platform-api",
      version: "0.1.0",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://seusite-deploy.com"
            : "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production"
            ? "Produção"
            : "Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido no login",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
