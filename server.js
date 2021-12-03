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

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});


swagger.configureSwaggerPaths('', 'api-docs', '');

//configurando dominio da API.
var domain = 'localhost'
if (argv.domain !== undefined)
  domain = arv.domain;
else
console.log('No --domain=xxx, especified, selecionando default, localhost');

//config de porta
var port = 8080;
if (argv.port !== undefined)
  port = argv.port;
else
console.log('Sem arg --port=xxx, selecionando porta padrão 8080');

var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API em ' + applicationUrl);

swagger.configure(applicationUrl, '1.0.0');

MongoClient.connect(db.url, (err, dbase) => {
  if (err)
    return console.log(err);

  const database = dbase.db("cep-api");
  require('./routes')(app, database);
  app.listen(port, () => { console.log("Funcionando em " + port); });
});


