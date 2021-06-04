var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var healthRoute = require('./routes/health');
const { readSecrets } = require('./config/secrets.config');
const { v4: uuidv4 } = require('uuid');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/retrieval-service/health', healthRoute);

async function init() {
  await readSecrets();
  process.env['taskName'] = uuidv4();
}

init().then(() => {
  app.listen(8080, () => {
    const { startLoading } = require('./service/loader.service')
    console.log(`Retrieval Service Started Successfully`);
    startLoading();
  });
});

module.exports = app;
