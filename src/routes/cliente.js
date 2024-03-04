const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const conectarBancoDados = require('../middlewares/conectarBD');
const EsquemaCliente = require('../models/cliente.js');
const router = express.Router();


router.post('/registrar', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Cliente']
    let { nome, sobrenome, endereco, email, numeroTelefone } = req.body;
    const respostaBD = await EsquemaCliente.create({ nome, sobrenome, endereco, email, numeroTelefone });

    res.status(200).json({
      status: "OK",
      statusMensagem: "Cliente cadastrado com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.put('/editar/:id', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Cliente']
    let { nome, sobrenome, endereco, email, numeroTelefone } = req.body;
    let idCliente = req.params.id;
    const ClienteAtualizado = await EsquemaCliente.updateOne({ _id: idCliente }, { nome, sobrenome, endereco, email, numeroTelefone });
    if (ClienteAtualizado?.modifiedCount > 0) {
      const dadosCliente = await EsquemaCliente.findOne({ _id: idCliente });

      res.status(200).json({
        status: "OK",
        statusMensagem: "Cliente atualizado com sucesso.",
        resposta: dadosCliente
      })
    }
  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/obter/clientes', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Cliente']
    const respostaBD = await EsquemaCliente.find({});

    res.status(200).json({
      status: "OK",
      statusMensagem: "Clientes listados na respota com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/obter/:id', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Cliente']
    const idCliente = req.params.id;

    const cliente = await EsquemaCliente.findOne({ _id: idCliente });

    if (!cliente) {
      res.status(404).json({
        status: "Erro",
        statusMensagem: "Cliente não encontrado."
      });
    } else {
      res.status(200).json({
        status: "OK",
        statusMensagem: "Cliente encontrado com sucesso.",
        resposta: cliente
      });
    }

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.delete('/deletar/:id', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Cliente']
    
    const idCliente = req.params.id;

    const checkCliente = await EsquemaCliente.findOne({ _id: idCliente });
    if (!checkCliente) {
      throw new Error("Cliente não encontrado");
    }

    const respostaBD = await EsquemaCliente.deleteOne({ _id: idCliente });
    res.status(200).json({
      status: "OK",
      statusMensagem: "Cadastro do Cliente foi deletado com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

module.exports = router;
