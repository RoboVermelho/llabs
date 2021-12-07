var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/cep/:cep',(req, res) => {
    const cep = req.params.cep;

    //Valida o formato do cep.
    var vld = /^\d{8}$/;
    if (!vld.test(cep)) {
      res.statusCode = 400;
      res.send({ msg : "Formato de cep inválido" });
    } else {
      //Registro as opções possiveis de cep, iniciando com o valor
      //pesquisado e adicionando outras opções com o preenchimento de '0'.
      const opcs = [cep];
      for (var i = 7; i > 2; i--) {
        opcs.push(cep.substring(0,i) + "0".repeat(8-i));
      }
      db.collection('cep').find({
        $query : { cep : { $in:  opcs }},
        $orderby : { cep : -1 },
        $limit : 1
      }).toArray(
          (err, item) => {
        if (item.length == 0) {
          res.statusCode = 404;
          res.send({ msg : "CEP não encontrado" });
        } else {
          res.send(item[0]);
        }
      });
    }
  });

};

