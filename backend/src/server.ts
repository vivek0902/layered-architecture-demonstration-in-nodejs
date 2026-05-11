import app from './app';
import { config } from './config';
import DatabaseConfig from './config/db.config';
import { configureDnsServers } from './dns';

// configure DNS servers from config (explicit, environment-driven)
configureDnsServers(config.DNS.SERVERS);

const startServer = async () => {
  try {
    await DatabaseConfig.connect();

    app.listen(config.PORT, () => {
      console.log(
        `${config.SERVICE_NAME} is running on port ${config.PORT} in ${config.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    await DatabaseConfig.disconnect();
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
