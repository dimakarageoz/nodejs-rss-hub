const express = require('express');

const db = require('./db');
const middleware = require('./middlewareActions');
const baseRouter = require('./router/base');
const authRouter = require('./router/authorize');
const channelRouter = require('./router/channel');

const app = express();

db.connect()
  .then(() => {
      middleware(app);

      app.use('/', authRouter);
      app.use('/', baseRouter);
      app.use('/', channelRouter);

      app.listen(5000, () => {
          console.log('app run')
      });
  })
  .catch(err => {
    console.log(err);
  })
;
