const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const conectarBancoDados = require('../middlewares/conectarBD');
const EsquemaVendas = require('../models/vendas.js');
const EsquemaPedidos = require('../models/pedidos.js');
const EsquemaEstoque = require('../models/estoque.js');
const EsquemaProduto = require('../models/produto.js');
const router = express.Router();

router.post('/vender/:idPedido', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Vendas']
    const { metodoPagamento } = req.body;
    const idPedido = req.params.idPedido;

    // Busca as informações do pedido pelo ID
    const pedido = await EsquemaPedidos.findOne({ _id: idPedido });

    // Verifica se o pedido foi encontrado
    if (!pedido) {
      return res.status(404).json({
        status: "Erro",
        statusMensagem: "Pedido não encontrado."
      });
    }

    // Calcula o valor total da venda com base nos produtos do pedido
    let valorTotalVenda = 0;
    for (const produto of pedido.produtos) {
      valorTotalVenda += produto.subtotal;
    }

    const itensPedido = pedido.produtos.map(produtoPedido => {
      return {
        nome: produtoPedido.nome,
        quantidade: produtoPedido.quantidade
      };
    });

    // Cria a venda com base nas informações do pedido
    const novaVenda = await EsquemaVendas.create({
      dataVenda: new Date(), // Define a data da venda como o momento atual
      valorTotalVenda,
      metodoPagamento,
      idCliente: pedido.idCliente,
      idPedido,
      itensPedido 
    });

    // Agora que a venda foi confirmada, podemos deduzir os produtos do estoque e do total de produtos
    for (const produtoPedido of pedido.produtos) {
      const estoque = await EsquemaEstoque.findOne({ idProduto: produtoPedido.idProduto });
      if (!estoque || estoque.quantidadeEstoque < produtoPedido.quantidade) {
        return res.status(400).json({
          status: "Erro",
          statusMensagem: "Quantidade insuficiente em estoque para o produto selecionado."
        });
      }
      estoque.quantidadeEstoque -= produtoPedido.quantidade;
      await estoque.save();  

      const produto = await EsquemaProduto.findById(produtoPedido.idProduto);
      if (!produto) {
        return res.status(400).json({
          status: "Erro",
          statusMensagem: "Produto não encontrado."
        });
      }
      produto.quantidadeProduto -= produtoPedido.quantidade;
      await produto.save(); 
    }

    res.status(201).json({
      status: "OK",
      statusMensagem: "Venda criada com sucesso.",
      resposta: novaVenda
    });
  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/obter/Vendas', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Vendas']
    const respostaBD = await EsquemaVendas.find({});

    res.status(200).json({
      status: "OK",
      statusMensagem: "Vendas listadas na resposta com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/obter/:id', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Vendas']
    const idVenda = req.params.id;

    const venda = await EsquemaVendas.findOne({ _id: idVenda });

    if (!venda) {
      res.status(404).json({
        status: "Erro",
        statusMensagem: "Venda não encontrada."
      });
    } else {
      res.status(200).json({
        status: "OK",
        statusMensagem: "Venda encontrada com sucesso.",
        resposta: venda
      });
    }

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.delete('/deletar/:id', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Vendas']
    const idVenda = req.params.id;

    const checkVenda = await EsquemaVendas.findOne({ _id: idVenda });
    if (!checkVenda) {
      throw new Error("Venda não encontrada");
    }

    const respostaBD = await EsquemaVendas.deleteOne({ _id: idVenda });
    res.status(200).json({
      status: "OK",
      statusMensagem: "Venda foi deletada com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

module.exports = router;
