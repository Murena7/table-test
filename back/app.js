const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes/api');

const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

module.exports = app;
