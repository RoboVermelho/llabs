const request = require("supertest");
const app = require("../server.js");
const {MongoClient} = require('mongodb');
const dbCfg = require('../config/db.js');

let connection;
let db;

let objTeste1 = { "cep" : "38411145",
    rua : "Avenida Paulo Gracindo",
    bairro : "Gávea",
    cidade : "Uberlandia",
    uf : "MG"
};

let objTeste2 = { cep : "38410000",
    rua : "rua Teste",
    bairro : "bairro Teste",
    cidade : "Cidade teste",
    uf : "MG"
};

let objTeste3 = { "cep" : "38411140",
    rua : "Avenida Paulo Gracindo",
    bairro : "Gávea",
    cidade : "Uberlandia",
    uf : "MG"
};


beforeAll(async() => {
  connection = await MongoClient.connect(dbCfg.test, {
    useNewUrlParser : true,
  });
  db = await connection.db("cep-api");
  db.collection('cep').drop();
  db.collection('cep').insert(objTeste3);
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
    expect(res.body.cep).toEqual(objTeste1.cep);
    expect(res.body.rua).toEqual(objTeste1.rua);
    expect(res.body.bairro).toEqual(objTeste1.bairro);
    expect(res.body.cidade).toEqual(objTeste1.cidade);
    expect(res.body.uf).toEqual(objTeste1.uf);
});

  it("Deve retornar um cep completo (cep com complemento de 0s)", async () => {
    const res = await request(app).get('/cep/38412345');
    expect(res.statusCode).toEqual(200);
    expect(res.body.cep).toEqual(objTeste2.cep);
    expect(res.body.rua).toEqual(objTeste2.rua);
    expect(res.body.bairro).toEqual(objTeste2.bairro);
    expect(res.body.cidade).toEqual(objTeste2.cidade);
    expect(res.body.uf).toEqual(objTeste2.uf);
  });

  it("Cep não encontrado", async () => {
    const res = await request(app).get('/cep/39412345');
    expect(res.statusCode).toEqual(404);
    expect(res.body.msg).toEqual("CEP não encontrado");
  });

  it("Formato de CEP inválido", async () => {
    const res = await request(app).get('/cep/aaa--445');
    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual("Formato de cep inválido");
  });

});
