var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/cep/:cep',(req, res) => {
    const cep = req.params.cep;

    //Valida o formato do cep.
    var vld = /^\d{5}\d{3}$/;
    if (!vld.test(cep)) {
      res.send({ error : "Formato de cep inválido" });
    } else {
      //Registro as opções possiveis de cep, iniciando com o valor
      //pesquisado e adicionando outras opções com o preenchimento de '0'.
      const opcs = [cep];
      for (var i = 7; i > 2; i--) {
        opcs.push(cep.substring(0,i) + "0".repeat(8-i));
      }
      db.collection('cep').find({
        $query : { cep : { $in:  opcs }},
        $orderby : { cep : -1 }
      }).toArray(
          (err, item) => {
      console.log(item);
        if (!item)
          res.send({ error : "CEP não encontrado" });
        else
          res.send(item[0]);
      });
    }
  });

  app.post('/cep', (req, res) => {
    const cep = { rua : req.body.rua, cep : req.body.cep };
    db.collection('cep').insert(cep, (err, result) => {
      if (err)
        res.send({ error : 'Um erro aconteceu: ' + err });
      else {
        res.send(result.ops[0]);
      }
    });
  });

};

