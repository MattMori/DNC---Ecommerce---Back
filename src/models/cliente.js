const mongoose = require('mongoose');

const esquema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },
    sobrenome: {
      type: String,
      required: true
    },
    endereco: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    numeroTelefone: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const EsquemaCliente = mongoose.models.Cliente || mongoose.model('Cliente', esquema);
module.exports = EsquemaCliente;
