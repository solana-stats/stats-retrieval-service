var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var healthRoute = require('./routes/health');
const { startLoading } = require('./service/loader.service')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/retrieval-service/health', healthRoute);

app.listen(8080, () => {
  console.log(`Retrieval Service Started Successfully`);
  startLoading();
});

module.exports = app;
