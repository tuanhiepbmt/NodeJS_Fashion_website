import express from '@core/express';
import logger from '@core/logger';
import config from '@utils/config';
import mongoose from 'mongoose'


/* Database */
// const connectionString =
//   `mongodb://${config.mongodb.username}:${encodeURIComponent(config.mongodb.password)}@${config.mongodb.host}/${config.mongodb.database}?authSource=admin&authMechanism=SCRAM-SHA-1&ssl=false`
// mongoose.Promise = Promise;
// mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connection.on('error', (error) => {
//   if (error) throw error;
// });
var dbConn = require('./lib/db');

express.listen(config.port, () => {
  logger.info(`🚀🚀🚀 Listening on port ${config.port}...`);
})