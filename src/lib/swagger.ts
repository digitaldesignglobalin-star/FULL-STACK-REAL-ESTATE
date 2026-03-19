import swaggerJsdoc from 'swagger-jsdoc';

export const getApiDocs = async () => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Real Estate API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Full Stack Real Estate application',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
    // Pattern to find the api routes
    apis: ['src/app/api/**/*.ts'],
  };

  const spec = swaggerJsdoc(options);
  return spec;
};
