const mongoose = require('mongoose');

const esquema = new mongoose.Schema(
  {
    produtos: [{
      nome: String,
      quantidade: Number,
      precoUnitario: Number,
      subtotal: Number,
      idProduto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto'
      }
    }],
    idCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente'
    }
  },
  {
    timestamps: true
  }
);

const EsquemaPedidos = mongoose.models.Pedidos || mongoose.model('Pedidos', esquema);
module.exports = EsquemaPedidos;
