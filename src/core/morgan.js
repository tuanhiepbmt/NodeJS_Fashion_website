import morgan from 'morgan';
import logger from '@core/logger';
import config from '@utils/config';


morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () =>  `${!config.isDev ? ':remote-addr - ' : ''}`;
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (_, response) => response.statusCode >= 400,
  stream: {
    write: (message) => logger.info(message.trim())
  },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_, response) => response.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default {
  successHandler,
  errorHandler,
}