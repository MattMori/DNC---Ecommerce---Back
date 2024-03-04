const mongoose = require('mongoose');
const EsquemaEstoque = require('../models/estoque.js');


const esquema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },
    descricao: {
      type: String
    },
    preco: {
      type: Number,
      required: true
    },
    quantidadeProduto: {
      type: Number,
      default: 0 
    }
  },
  {
    timestamps: true
  }
);

esquema.post('save', async function (doc, next) {
  try {
    // Verifica se já existe um item no estoque com o mesmo id do produto
    const estoqueExistente = await EsquemaEstoque.findOne({ idProduto: doc._id });

    // Se o item no estoque já existir, não é necessário criar outro
    if (!estoqueExistente) {
      // Cria um novo item no estoque apenas se não existir
      await EsquemaEstoque.create({
        produto: doc.nome,
        quantidadeEstoque: 0,
        idProduto: doc._id
      });
    }
    next();
  } catch (error) {
    console.error('Erro ao salvar estoque:', error);
    next(error); // Chama o próximo middleware com o erro
  }
});



const EsquemaProduto = mongoose.models.Produto || mongoose.model('Produto', esquema);
module.exports = EsquemaProduto;
