import path from 'path';
import dotenv from 'dotenv';

dotenv.config(path.join(__dirname, '../../.env'));
const config = {
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT || 3000,
  mongodb: {
    host: process.env.MONGODB_URL || 'localhost',
    port: process.env.MONGODB_PORT || 3306,
    username: process.env.MONGODB_USERNAME || 'admin',
    password: process.env.MONGODB_PASSWORD || 'admin',
  }
};

export default config;