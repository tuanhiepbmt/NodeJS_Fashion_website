import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import ejsMate from 'ejs-mate';
import morgan from '@core/morgan';
import logger from '@core/logger';
import clientRoutes from '@routes/client';
import adminRoutes from '@routes/admin';
import constants from '@utils/constants';
import config from '@utils/config';

const app = express();
const session = require('express-session')
app.use(session({
  secret: 'doraemon',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    maxAge: 99999999999999999999  
  },
}))
/* view engine */
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '../../src/views'));
app.use(express.static(path.join(__dirname, '../../public')))
app.set('view engine', 'ejs');

/* config express */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* logs */
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

/* routes */
clientRoutes.forEach((r) => {
  if (constants.CLIENT_ROUTE.length === 1 && constants.CLIENT_ROUTE.includes('/'))
    app.use(r);
  else
    app.use(constants.CLIENT_ROUTE, r);
});

adminRoutes.forEach((r) => {
  if (constants.ADMIN_ROUTE.length === 1 && constants.ADMIN_ROUTE.includes('/'))
  app.use(r);
else
  app.use(constants.ADMIN_ROUTE, r);
});

/* handle exception */
app.use((error, request, response, next) => {
  let { statusCode, message } = error;

  message = `Lỗi: ${message}`;
  if (!config.isDev && !error.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Lỗi hệ thống!';
  }

  logger.error(error);
  response.locals.errorMessage = error?.message ? `Lỗi: ${error.message}` : 'Lỗi hệ thống!';
  response.render('common/error', {
    error: {
      statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message,
    },
  });
});

app.use((request, response, next) => {
  response.render('common/error', { error: { statusCode: `404`, message: 'Không tìm thấy trang!' }});
});

export default app;