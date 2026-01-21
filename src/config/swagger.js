const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sou Gas Backend API',
      version: '1.0.0',
      description: 'API documentation for Sou Gas application',
      contact: {
        name: 'API Support',
        email: 'support@sougas.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
      {
        url: 'https://sou-gas-backend.onrender.com/api',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            fullName: { type: 'string', description: 'Full name of the user' },
            email: { type: 'string', format: 'email', description: 'User email' },
            phoneNumber: { type: 'string', description: 'User phone number' },
            role: { type: 'string', enum: ['customer', 'driver'], description: 'User role' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            token: { type: 'string', description: 'JWT Access Token' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = swaggerDocs;
