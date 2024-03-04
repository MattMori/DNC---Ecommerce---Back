const mongoose = require('mongoose');

const esquema = new mongoose.Schema({
  produto: {
    type: String,
    required: true
  },
  quantidadeEstoque: {
    type: Number,
    default: 0
  },
  idProduto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto'
  }  
},
{
  timestamps: true
});

const EsquemaEstoque = mongoose.models.Estoque || mongoose.model('Estoque', esquema);
module.exports = EsquemaEstoque;
