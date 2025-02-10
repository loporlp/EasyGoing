export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Easy Going API",
        description: "API for managing trips in database, fetching directions, and Google Places data",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local Development Server",
        },
        {
            url: "https://ezgoing.app",
            description: "Production Server",
        }
      ],
    },
    apis: ["server.js"], 
  };
  
