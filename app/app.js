var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var healthRoute = require('./routes/health');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/retrieval-service/health', healthRoute);

app.listen(8080, () => {
  console.log(`Retrieval Service Started Successfully`);
});

module.exports = app;
