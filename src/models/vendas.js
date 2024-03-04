const mongoose = require('mongoose');

const esquema = new mongoose.Schema(
  {
    dataVenda: {
      type: Date,
      required: true
    },
    valorTotalVenda: {
      type: Number,
      required: true
    },
    metodoPagamento: {
      type: String,
      required: true
    },
    idCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente'
    },
    idPedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedidos'
    },
    itensPedido: [{
      nome: String,
      quantidade: Number
    }]
  }
);

const EsquemaVendas = mongoose.models.Vendas || mongoose.model('Vendas', esquema);
module.exports = EsquemaVendas;
