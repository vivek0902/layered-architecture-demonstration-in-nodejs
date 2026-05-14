interface Config {
  SERVICE_NAME: string;
  PORT: number;
  MONGODB: { URI: string };
  LOG_LEVEL: string;
  API: {
    PREFIX: string;
    VERSION: string;
  };
  CORS: {
    ORIGIN: string;
    CREDENTIALS: boolean;
    METHODS: string;
  };
  NODE_ENV: 'development' | 'production' | 'test';
  DNS: {
    SERVERS: string[];
  };
}

export const config: Config = {
  SERVICE_NAME: require('../../package.json').name,

  PORT: Number(process.env.PORT) || 3001,

  MONGODB: {
    URI:
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/layered_architecture_db',
  },

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  API: {
    PREFIX: process.env.API_PREFIX || '/api/v1',
    VERSION: process.env.API_VERSION || 'v1',
  },

  CORS: {
    ORIGIN:
      process.env.CORS_ORIGIN ||
      (process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || '*'
        : '*'),
    CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
    METHODS: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS',
  },
  DNS: {
    SERVERS: (process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
  NODE_ENV:
    (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
    'development',
};
