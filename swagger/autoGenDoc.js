const mongooseToSwagger = require('mongoose-to-swagger');
const EsquemaCliente = require('../src/models/cliente.js');
const EsquemaPedidos = require('../src/models/pedidos.js');
const EsquemaProduto = require('../src/models/produto.js');
const EsquemaVendas = require('../src/models/vendas.js'); 
const EsquemaEstoque = require('../src/models/estoque.js');
const swaggerAutogen = require('swagger-autogen')({
    openapi: '3.0.0',
    language: 'pt-BR',
});

let outputFile = './swagger_output.json';
let endpointsFiles = ['../index.js', '../src/routes.js'];


if(String(process.env.OS).toLocaleLowerCase().includes("windows")){
    outputFile = './swagger/swagger_output.json';
    endpointsFiles = ['./index.js', './src/routes.js'];
}


let doc = {
    info: {
        version: "1.0.0",
        title: "API do E-commerce DNC-back",
        description: "Documentação da API do E-commerce DNC-back."
    },
    servers: [
        {
            "url": "https://dnc-ecommerce-back.vercel.app/",
            "description": "Servidor de produção."
          },
          {
            "url": "http://localhost:3500/",
            "description": "Servidor localhost."
          }
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
        schemas: {
            Cliente: mongooseToSwagger(EsquemaCliente),
            Pedidos: mongooseToSwagger(EsquemaPedidos),
            Produto: mongooseToSwagger(EsquemaProduto),
            Vendas: mongooseToSwagger(EsquemaVendas),
            Estoque: mongooseToSwagger(EsquemaEstoque)            
            
        }
    }
}


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentação do Swagger gerada encontra-se no arquivo em: " + outputFile);
    if (process.env.NODE_ENV !== 'production') {
        require("../index.js");
    }
})
