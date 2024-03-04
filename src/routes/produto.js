  const express = require('express');
  const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
  const conectarBancoDados = require('../middlewares/conectarBD');
  const EsquemaProduto = require('../models/produto.js');
  const router = express.Router();

  router.post('/criar', conectarBancoDados, async function (req, res) {
    try {
      // #swagger.tags = ['Produto']
      const { nome, descricao, preco } = req.body;
      const respostaBD = await EsquemaProduto.create({ nome, descricao, preco});

      res.status(200).json({
        status: "OK",
        statusMensagem: "Produto cadastrado com sucesso.",
        resposta: respostaBD
      })

    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  router.put('/editar/:id', conectarBancoDados, async function (req, res) {
    try {
      // #swagger.tags = ['Produto']
      const { nome, descricao, preco} = req.body;
      const idProduto = req.params.id;
      const produtoAtualizado = await EsquemaProduto.updateOne({ _id: idProduto }, { nome, descricao, preco, modifiedAt: new Date()});
      if (produtoAtualizado?.modifiedCount > 0) {
        const dadosProduto = await EsquemaProduto.findOne({ _id: idProduto });

        res.status(200).json({
          status: "OK",
          statusMensagem: "Produto atualizado com sucesso.",
          resposta: dadosProduto
        })
      }
    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  router.get('/obter/Produtos', conectarBancoDados, async function (req, res) {
    try {
      // #swagger.tags = ['Produto']
      const respostaBD = await EsquemaProduto.find({});

      res.status(200).json({
        status: "OK",
        statusMensagem: "Produtos listados na resposta com sucesso.",
        resposta: respostaBD
      })

    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  router.get('/obter/:id', conectarBancoDados, async function (req, res) {
    try {
      // #swagger.tags = ['Produto']
      const idProduto = req.params.id;

      const produto = await EsquemaProduto.findOne({ _id: idProduto });

      if (!produto) {
        res.status(404).json({
          status: "Erro",
          statusMensagem: "Produto não encontrado."
        });
      } else {
        res.status(200).json({
          status: "OK",
          statusMensagem: "Produto encontrado com sucesso.",
          resposta: produto
        });
      }

    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  router.delete('/deletar/:id', conectarBancoDados, async function (req, res) {
    try {
      // #swagger.tags = ['Produto']
      const idProduto = req.params.id;

      const checkProduto = await EsquemaProduto.findOne({ _id: idProduto });
      if (!checkProduto) {
        throw new Error("Produto não encontrado");
      }

      const respostaBD = await EsquemaProduto.deleteOne({ _id: idProduto });
      res.status(200).json({
        status: "OK",
        statusMensagem: "Produto foi deletado com sucesso.",
        resposta: respostaBD
      })

    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  module.exports = router;
