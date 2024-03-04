const express = require('express');
const router = express.Router();
const conectarBancoDados = require('../middlewares/conectarBD');
const EsquemaEstoque = require('../models/estoque.js');
const EsquemaProduto = require('../models/produto.js');


// Rota para atualizar um item do estoque
router.put('/atualizarEstoque/:idProduto', conectarBancoDados, async (req, res) => {
  // #swagger.tags = ['Estoque']
  try {
    const idProduto = req.params.idProduto;
    const { nome, descricao, preco, novaQuantidade } = req.body;
    //const novaQuantidade = req.body.novaQuantidade;

    // Verifica se o produto existe
    const produto = await EsquemaProduto.findById(idProduto);
    if (!produto) {
      return res.status(404).json({
        status: 'Erro',
        mensagem: 'Produto não encontrado'
      });
    }

    // Atualiza a quantidade no estoque
    const estoque = await EsquemaEstoque.findOneAndUpdate(
      { idProduto: idProduto },
      { quantidadeEstoque: novaQuantidade, produto: nome },
      { new: true }
    );

    const produtoAtualizado = await EsquemaProduto.findOneAndUpdate(
      { _id: idProduto },
      { quantidadeProduto: novaQuantidade },
      { nome, descricao, preco },
      { new: true }
    );

    // Verifique se o estoque foi encontrado
    if (!estoque) {
      return res.status(404).json({
        status: 'Erro',
        mensagem: 'Item do estoque não encontrado'
      });
    }


    return res.status(200).json({
      status: 'OK',
      mensagem: 'Estoque atualizado com sucesso',
      resposta: estoque
    });

  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    return res.status(500).json({ status: 'Erro', mensagem: 'Erro ao atualizar estoque' });
  }
});

// Rota para listar todos os itens do estoque
router.get('/', conectarBancoDados, async (req, res) => {
  // #swagger.tags = ['Estoque']
  try {
    const estoque = await EsquemaEstoque.find();
    res.json(estoque);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para buscar um item específico no estoque por ID
router.get('/obter/:idProduto', conectarBancoDados, async function (req, res) {
  // #swagger.tags = ['Estoque']
  try {
    const idProduto = req.params.idProduto;
    const itemEstoque = await EsquemaEstoque.findOne({ idProduto });

    if (itemEstoque) {
      return res.status(200).json({
        status: 'OK',
        mensagem: 'Item encontrado no estoque',
        resposta: itemEstoque
      });
    }
    
    return res.status(404).json({
      status: 'Erro',
      mensagem: 'Item do estoque não encontrado'
    });
  } catch (error) {
    console.error('Erro ao buscar item no estoque:', error);
    return res.status(500).json({
      status: 'Erro',
      mensagem: 'Erro ao buscar item no estoque'
    });
  }
});


// Rota para remover produtos do estoque
router.delete('/:idProduto/remover', conectarBancoDados, async (req, res) => {
  // #swagger.tags = ['Estoque']

  try {
    const idProduto = req.params.idProduto;
    await EsquemaEstoque.deleteOne({ idProduto });
    await EsquemaProduto.deleteOne({ _id: idProduto });
    res.status(200).json({ status: 'OK', mensagem: 'Produto removido do sistema com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto do estoque:', error);
    return res.status(500).json({ status: 'Erro', mensagem: 'Erro ao remover produto do estoque' });
  }
});


module.exports = router;
