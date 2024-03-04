function routes(app) {
    app.use('/cliente', require('./routes/cliente'));
    app.use('/pedidos', require('./routes/pedidos'));
    app.use('/produto', require('./routes/produto'));
    app.use('/vendas', require('./routes/vendas'));
    app.use('/estoque', require('./routes/estoque'));
    return;
}

module.exports = routes;