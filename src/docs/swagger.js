// src/docs/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "API – Inventario & Ventas",
    version: "1.0.0",
    description:
      "API para gestión de productos, stock, usuarios y ventas.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  // Escanea tus rutas y controladores para JSDoc
  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js",
  ],
});
