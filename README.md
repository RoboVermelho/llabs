API para consulta de CEPs
---------------------------

Esta pequena API realiza consulta de endereços à partir do cep indicado.

Sobre o funcionamento
=====================
A configuração do servidor se encontra no arquivo server.js, neste arquivo
temos a configuração da framework de configuração Swagger e a conexão com o
banco de dados MongoDB.
O arquivo de configuração com a URL de conexão do MongoDB está em
config/db.js.

index.js
--------
Este arquivo tem a única função de iniciar a aplicação. Ela foi separada do
arquivo *server.js*, para facilitar a execução de testes da API.

routes/index.js
---------------
Este arquivo funciona apenas como agregador de arquivos de rotas. Mesmo a
aplicação tendo apenas um ponto de acesso, o arquivo foi mantido por ser
considerada uma boa prática em uma possível expansão do sistema.

routes/cep_routes.js
--------------------
O arquivo que realmente implementa as regras de negócio. Possui apenas um
ponto de entrada, que é a recepção do valor do cep no próprio corpo da url
através de um metodo *get* na url: http://localhost/cep/NUMERO_CEP

O método inicia filtrando as entradas através de uma expressão regular,
filtrando uma sequência de oito números. Caso a sequência seja inválida, o
método retorna o status code 400, e um json com o campo msg "Formato de cep
inválido".
Caso o formato seja válido, para conseguir cumprir o requisito de:
"Verificar o número de cep indicado, e caso não seja encontrado, pesquisar
por número com preenchimento de zero à esquerda (Ex: 12345678, 12345670,
etc..)", foi criada uma rotina que preenche um array com estes valores
(linhas 15 a 18).
  Depois é feita uma consulta no document cep, com a lista de opções em uma
  cláusula $in, e é feita a ordenação de forma decrescente pelo campo cep.
  A ordem é necessária, pois ela faz com que um número mais completo
  apareça primeiro na consulta, e limito os resultados apenas o primeiro
  registro.
  Depois finalmente é verificada a quantidade de registros, e caso não haja
  registros, a resposta vem com status code 404 e um json com o campo msg:
  "CEP não encontrado".
  Caso o cep seja encontrado, ele é retornado ao usuário.

Sobre a plataforma de testes
============================
A plataforma de testes selecionada foi a suite de testes Jest e o pacote
npm supertest para automatizar os testes da API. Antes de adotar este
procedimento, foi utilizada a plataforma de testes Postman.
Os testes da API foram arquivados no diretório __tests__ 

Sobre as dificuldades do projeto e escolha da plataforma
========================================================
Selecionei a plataforma NodeJS/MongoDB, por acreditar que ela tem um grande
uso atualmente, apesar de não possuir experiência com o servidor e com o
banco de dados, tenho experiência com javascript frontend, o que já
facilitou o entendimento da sintaxe como um todo.
A maior dificuldade foi que praticamente todas as ferramentas utilizadas
(NodeJS, MongoDB, Swagger, Jest e Supertest) foram novidades, porém foi
muito interessante aprender a trabalhar com todas elas.



