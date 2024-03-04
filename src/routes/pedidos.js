const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const conectarBancoDados = require('../middlewares/conectarBD');
const EsquemaPedidos = require('../models/pedidos.js');
const EsquemaCliente = require('../models/cliente.js');
const EsquemaProduto = require('../models/produto.js');
const EsquemaEstoque = require('../models/estoque.js');
const router = express.Router();

router.put('/adicionarProduto/:idCliente', conectarBancoDados, async function (req, res) {
  // #swagger.tags = ['Pedidos']
  try {
    const idCliente = req.params.idCliente;
    const { idProduto, quantidade } = req.body;

    // Verifica se o cliente está cadastrado
    const clienteCadastrado = await EsquemaCliente.findOne({ _id: idCliente });
    if (!clienteCadastrado) {
      return res.status(404).json({
        status: "Erro",
        statusMensagem: "Cliente não encontrado."
      });
    }

    // Verifica se há algum pedido associado ao cliente
    let pedidoExistente = await EsquemaPedidos.findOne({ idCliente: idCliente });

    // Se não houver pedido existente, cria um novo pedido
    if (!pedidoExistente) {
      const produto = await EsquemaProduto.findOne({ _id: idProduto });
      if (!produto) {
        return res.status(400).json({
          status: "Erro",
          statusMensagem: "Produto não encontrado."
        });
      }

      const precoUnitario = produto.preco;
      const subtotal = precoUnitario * quantidade;

      pedidoExistente = await EsquemaPedidos.create({
        produtos: [{
          nome: produto.nome,
          quantidade,
          precoUnitario,
          subtotal,
          idProduto
        }],
        idCliente
      });
    } else {
      // Verifica se o produto existe
      const produto = await EsquemaProduto.findOne({ _id: idProduto });
      if (!produto) {
        return res.status(400).json({
          status: "Erro",
          statusMensagem: "Produto não encontrado."
        });
      }

      // Verifica se há estoque suficiente do produto
      const estoque = await EsquemaEstoque.findOne({ idProduto });
      if (!estoque || estoque.quantidadeEstoque < quantidade) {
        return res.status(400).json({
          status: "Erro",
          statusMensagem: "Quantidade insuficiente em estoque para o produto selecionado."
        });
      }

      const precoUnitario = produto.preco;
      const subtotal = precoUnitario * quantidade;

      // Adiciona o novo produto ao pedido existente
      const novoProduto = {
        nome: produto.nome,
        quantidade,
        precoUnitario,
        subtotal,
        idProduto
      };

      pedidoExistente.produtos.push(novoProduto);
    }
    // Salva o pedido atualizado ou recém-criado
    await pedidoExistente.save();

    res.status(200).json({
      status: "OK",
      statusMensagem: "Produto adicionado ao pedido com sucesso.",
      resposta: pedidoExistente
    });

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/obterPedido/:idCliente', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Pedidos']
    const idCliente = req.params.idCliente;
    const respostaBD = await EsquemaPedidos.find({ idCliente });

    res.status(200).json({
      status: "OK",
      statusMensagem: "Pedido do cliente listado com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.delete('/deletar/:id/:idCliente', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Pedidos']
    const idPedido = req.params.id;
    const idCliente = req.params.idCliente;

    const checkPedido = await EsquemaPedidos.findOne({ _id: idPedido, idCliente });
    if (!checkPedido) {
      throw new Error("Pedido não encontrado para o cliente fornecido");
    }

    const respostaBD = await EsquemaPedidos.deleteOne({ _id: idPedido });
    res.status(200).json({
      status: "OK",
      statusMensagem: "Pedido foi deletado com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

module.exports = router;
