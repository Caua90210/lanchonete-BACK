/****************************************************************
 * Objetivo: Arquivo responsavel pelos endpoints
 * Data: 16/05/2024
 * Autor: Cauã, Ricardo, Gabrielle e Nathalia
 * Versão: 1.0
 ****************************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) =>{

    // Permite especificar quem podera acessar a API ('*' = Liberar acesso público, 'IP' = Liberar acesso apenas para aquela maquina);
    response.header('Access-Control-Allow-Origin', '*')

    // Permite especificar como a API, sera requisitada ('GET', 'POST', 'PUT' e 'DELETE')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa as confgurações de cors
    app.use(cors())


    next()
})

/*********************** Import dos arquivos de controller do projeto ***********************************/
    const controllerProduto = require('./controller/controller_produto.js')
/*******************************************************************************************************/

// Criando um objeto para controlar a chegada dos dados da requisição em formato JSON
const bodyParserJSON = bodyParser.json()


//       --------------------   CRUD PRODUTOS  ---------------------        //


    // -> EndPoint: Versão 2.0 - Retorna os dados de produtos do Banco de Dados
    app.get('/v1/lanchonete/produtos', cors(), async function(request, response){

        // -> Chama a função da controller para retornar todos os filmes
        let dadosProduto = await controllerProduto.getListarProdutos()

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosProduto.status_code)
        response.json(dadosProduto)
    })

    // //EndPoint: Ele retorna os dados do filme filtrado pelo nome
    // app.get('/v2/acmeFilmes/Filmes/Filtro', cors(), async function(request, response){
    //     let nome = request.query.nome
    //     let dadosFilmes = await controllerFilmes.getNomeFilme(nome)

    //     response.status(dadosFilmes.status_code)
    //     response.json(dadosFilmes)
    // })

    // // EndPoint: ele retorna os dados pelo id
    app.get('/v1/lanchonete/produto/:id', cors(), async function(request, response, next){

        // Recebe o id da requisição
        let idProduto = request.params.id
        // Encaminha o ID para a controller buscar o Filme
        let dadosProduto = await controllerProduto.getBuscarProdutoId(idProduto)

        
        response.status(dadosProduto.status_code)
        response.json(dadosProduto)
    })

    // //EndPoint: Ele insere dados sobre o filme
    app.post('/v1/lanchonete/produto', cors(), bodyParserJSON, async function(request, response){

        // Recebe o content-type da requisição
        let contentType = request.headers['content-type']

        //Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body

        //Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoProduto = await controllerProduto.setInserirNovoProduto(dadosBody, contentType)
        
        response.status(resultDadosNovoProduto.status_code)
        response.json(resultDadosNovoProduto)
    })

     //EndPoint: Ele deleta os dados pelo id 
    app.delete('/v2/lanchonete/produto/:id', cors(), async function(request, response, next){
        let idProduto = request.params.id

        let dadosProduto = await controllerProduto.setExcluirProduto(idProduto)

        response.status(dadosProduto.status_code)
        response.json(dadosProduto)
    })

    // app.put('/v2/acmeFilmes/filme/:id', cors(), bodyParserJSON, async function(request, response){
    //     let contentType = request.headers['content-type']
    //     let dadosBody = request.body
    //     let idFilme = request.params.id

    //     let dadosFilme = await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)

    //     response.status(dadosFilme.status_code)
    //     response.json(dadosFilme)
    // })


    app.listen('8080', function(){
        console.log('API funcionando!!')
    })




    