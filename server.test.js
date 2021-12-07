var request = require("supertest");
const app = require("./server.js");
const {MongoClient} = require('mongodb');
const dbCfg = require('./config/db.js');

let connection;
let db;
let objTeste1 = { "cep" : "38411145",
    rua : "Avenida Paulo Gracindo",
    bairro : "Gávea",
    cidade : "Uberlandia",
    uf : "MG"
  };

let objTeste2 = { cep : "38411100",
    rua : "rua Teste",
    bairro : "bairro Teste",
    cidade : "Cidade teste",
    uf : "MG"
}


beforeAll(async() => {
  connection = await MongoClient.connect(dbCfg.test, {
    useNewUrlParser : true,
  });
  db = await connection.db("cep-api");
  db.collection('cep').drop();
  db.collection('cep').insert(objTeste2);
  db.collection('cep').insert(objTeste1);
});

afterAll(async () => {
  await connection.close();
  await db.close();
});


describe("Testando a home page", () => {
  it("Deve retornar o acesso à home page", async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe("Testando a consulta", () => {
  it("Deve retornar um cep completo (cep exato)", async () => {
    const res = await request(app).get('/cep/38411145');
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
    expect(res.body.cep).toEqual(objTeste1.cep);
    expect(res.body.rua).toEqual(objTeste1.rua);
    expect(res.body.bairro).toEqual(objTeste1.bairro);
    expect(res.body.cidade).toEqual(objTeste1.cidade);
    expect(res.body.uf).toEqual(objTeste1.uf);
});

  it("Deve retornar um cep completo (cep com complemento de 0s)", async () => {
    const res = await request(app).get('/cep/35411145');
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
    expect(res.body.cep).toEqual(objTeste2.cep);
    expect(res.body.rua).toEqual(objTeste2.rua);
    expect(res.body.bairro).toEqual(objTeste2.bairro);
    expect(res.body.cidade).toEqual(objTeste2.cidade);
    expect(res.body.uf).toEqual(objTeste2.uf);
  });

});
