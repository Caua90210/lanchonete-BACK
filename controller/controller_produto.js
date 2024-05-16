/****************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de produtos
 * Data: 16/05/2024
 * Autor: Cauã da Silva
 * Versão: 2.0
 ****************************************************************/

const produtoDAO = require('../model/DAO/produto.js')
const message = require('./modulo/config.js')

// Função para listar produtos
const getListarProdutos = async function() {
    try {
        // Criar o objeto JSON
        let produtoJSON = {};
        
        // Chamar a função do DAO para retornar os dados da tabela de produtos
        
        let dadosProduto = await produtoDAO.selectAllProdutos();
        console.log(dadosProduto);

        // Validação para verificar se existem dados 
        if (dadosProduto) {
            // Criar o JSON para devolver para o APP
            produtoJSON.produtos = dadosProduto;
            produtoJSON.quantidade = dadosProduto.length;
            produtoJSON.status_code = 200;
            return produtoJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        } 
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER;
    }
}

const getBuscarProdutoId = async function (id){

    try{

    
    // Recebe o id do genero
    let idProduto = id;
    //Cria o objeto JSON
    let produtoJSON = {};

    //tratamento do ID para verificar se o ID é válido(vazio, indefinido ou não numerico)
    if(idProduto == '' || idProduto == undefined || isNaN(idProduto)){
        return message.ERROR_INVALID_ID //400
    } else {

        // encaminha o id para o DAO buscar no banco de dados 
        let dadosProduto = await produtoDAO.selectProdutobyID(id)

        // verifca se o DAO retornou dados 
        if(dadosProduto){

            // Validação para verificar a quantidade de itens retornados
            if(dadosProduto.length > 0){
                 // Cria o JSON para retorno 
                 produtoJSON.produto = dadosProduto;
                 produtoJSON.status_code = 200;

            return produtoJSON;
            } else{
                return message.ERROR_NOT_FOUND
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
} catch (error) {
    return message.ERROR_INTERNAL_SERVER
}
}

const setInserirNovoProduto = async function (dadosProduto, contentType ){

    try{

    
    // validação para aplicação do contentType
    if(String(contentType).toLowerCase() == 'application/json'){

    // cria o objeto JSON para devolver os dados criados na requisição
    let produtoJSON = {};
    

    
    // validação de campos obrigatorios ou com digitação inválida
    if(dadosProduto.nome == ''    || dadosProduto.nome == undefined                  ||  dadosProduto.nome == null                        || dadosProduto.nome.length > 45       ||
    dadosProduto.valor == ''      || dadosProduto.valor == undefined         ||  dadosProduto.valor == null               || dadosProduto.valor.length > 300     ||
    dadosProduto.foto == ''    || dadosProduto.foto == undefined       ||  dadosProduto.foto == null             || dadosProduto.foto.length > 350  ||
    dadosProduto.tabela_nutricional == '' || dadosProduto.tabela_nutricional == undefined || dadosProduto.tabela_nutricional == null || dadosProduto.tabela_nutricional.length > 350 ||
    dadosProduto.quantidade == '' || dadosProduto.quantidade == undefined || dadosProduto.quantidade == null || dadosProduto.quantidade.length > 30000 ||
    dadosProduto.descricao == '' || dadosProduto.descricao == undefined || dadosProduto.descricao == null || dadosProduto.descricao.length > 3000
    ){

    
        // return do status code 400
        return message.ERROR_REQUIRED_FIELDS
    
    } else {

        

        // Encaminha os dados do filme para o DAO inserir dados
        let novoProduto = await produtoDAO.insertProduto(dadosProduto);

    // console.log(novaClassificacao);

       

        // validação para verificar se o DAO inseriu os dados do BD
        if (novoProduto)
        {

            let lastId = await produtoDAO.lastIDProduto()
            dadosProduto.id = lastId[0].id
        
            // se inseriu cria o JSON dos dados (201)
            produtoJSON.produto  = dadosProduto
            produtoJSON.status = message.SUCCESS_CREATED_ITEM.status
            produtoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
            produtoJSON.message = message.SUCCESS_CREATED_ITEM.message 

            return produtoJSON; // 201
        }else{
         
            return message.ERROR_INTERNAL_SERVER_DB // 500
            }
         
      }
    } else {
        return message.ERROR_CONTENT_TYPE // 415
    }
} catch(error){
    return message.ERROR_INTERNAL_SERVER // 500
}

}

module.exports = {
    getListarProdutos,
    getBuscarProdutoId,
    setInserirNovoProduto
};
