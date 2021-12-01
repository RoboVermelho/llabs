const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db.js');
const app = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
MongoClient.connect(db.url, (err, dbase) => {
  if (err)
    return console.log(err);

  const database = dbase.db("cep-api");
  require('./routes')(app, database);
  app.listen(port, () => { console.log("Funcionando em " + port); });
});
