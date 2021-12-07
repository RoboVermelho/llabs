const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db.js');
const argv = require("minimist")(process.argv.slice(2));
const app = express();
var subpath = express();
var port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/v1", subpath);
var swagger = require("swagger-node-express").createNew(subpath);

app.use(express.static('dist'));

swagger.setApiInfo({
  title : "API de consulta de CEPs",
  description: "API que realiza consulta de endereços através de número de cep",
  termsOfServiceUrl: "",
  contact: "sergio.ricardo87@gmail.com",
  license: "",
  licenseUrl: ""
});

//Adicionando rota para o Swagger.
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');

//Iniciando com conexão ao MongoDB.
MongoClient.connect(db.url, (err, dbase) => {
  if (err)
    return console.log(err);

  const database = dbase.db("cep-api");
  require('./routes')(app, database);
});

module.exports = app

