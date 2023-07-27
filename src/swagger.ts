import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  info: {
    title: 'API de Download de Vídeos',
    version: '1.0.0',
    description:
      'Esta API permite baixar vídeos da internet. Ela fornece endpoints para enviar uma URL de vídeo e receber o arquivo de vídeo correspondente para download.',
  },

  host: process.env.HOST,
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts'],
};

const swaggerSpec: any = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
swaggerSpec.components = {
  schemas: {
    FileRequest: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://vm.tiktok.com/ZM24xQFHe/',
          description: 'A URL do arquivo a ser baixado.',
        },
      },
    },
    FileResponse: {
      type: 'object',
      properties: {
        errorMessage: {
          type: 'string',
          example: null,
        },
        filename: {
          type: 'string',
          example: '82cEdv4u_1689692210169.mp4',
        },
        origin: {
          type: 'string',
          example: 'https://vm.tiktok.com/ZM24xQFHe//',
        },
        path: {
          type: 'string',
          example: 'public/savefrom/82cEdv4u_1689692210169.mp4',
        },
        size: {
          type: 'integer',
          example: 2904923,
        },
        urlDownload: {
          type: 'string',
          example:
            'http://localhost:5001/public/savefrom/82cEdv4u_1689692210169.mp4',
        },
        quality: {
          type: 'string',
          example: null,
        },
        type: {
          type: 'string',
          example: 'video',
        },
      },
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Ocorreu um erro.',
        },
      },
    },
  },
};
