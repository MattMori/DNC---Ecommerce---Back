# DNC E-Commerce - Back-End

Este é o back-end para um sistema de e-commerce desenvolvido como parte do desafio 6 da formação em tecnologia da escola DNC. A API foi criada com Node.js e Express, e está integrada com um banco de dados MongoDB para o armazenamento de informações relacionadas a clientes, produtos, pedidos, vendas e estoque.

## Tecnologias Utilizadas

- **Node.js** – Ambiente de execução.
- **Express.js** – Framework para construção da API.
- **MongoDB** – Banco de dados NoSQL.
- **Mongoose** – Modelagem de dados para MongoDB.
- **Swagger** – Documentação da API.
- **dotenv** – Gerenciamento de variáveis de ambiente.
- **cors** – Permite requisições cross-origin.
- **nodemon** – Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/MattMori/DNC-E-Commerce-Back.git
   cd DNC-E-Commerce-Back
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com base no `.env.example`:
   ```ini
   MONGO_URI= # URI de conexão com o MongoDB
   PORT=4000  # Porta onde o servidor será iniciado (opcional)
   ```

## Executando a Aplicação
Para iniciar o servidor, use o comando:
```bash
npm start
```

O servidor será iniciado na porta definida no arquivo `.env`, ou na porta `4000` por padrão.

## Endpoints Principais

### Clientes
- `POST /clientes`: Cadastro de um novo cliente.
- `GET /clientes`: Lista todos os clientes.
- `GET /clientes/:id`: Buscar cliente pelo ID.
- `PUT /clientes/:id`: Editar dados do cliente.
- `DELETE /clientes/:id`: Deletar cliente.

### Produtos
- `POST /produtos`: Cadastrar um novo produto.
- `GET /produtos`: Listar todos os produtos.
- `GET /produtos/:id`: Buscar produto específico pelo ID.

### Pedidos
- `POST /pedidos`: Incluir um item em um pedido.
- `GET /pedidos/:clienteId`: Listar pedidos de um cliente.
- `DELETE /pedidos/:id`: Deletar pedido de um cliente.

### Vendas
- `POST /vendas`: Gerar uma venda.
- `GET /vendas`: Buscar todas as vendas.
- `GET /vendas/:id`: Buscar venda específica pelo ID.
- `DELETE /vendas/:id`: Deletar venda específica.

### Estoque
- `GET /estoque`: Verificar o estoque disponível para produtos.

## Documentação

A documentação completa da API pode ser acessada através do Swagger UI, disponível no seguinte link:
[Swagger UI](https://dnc-ecommerce-back.vercel.app/doc/)
Senha para acesso aos testes: `123`

## Contribuição
Contribuições são bem-vindas! Caso encontre algum problema ou tenha sugestões de melhorias, abra uma issue ou envie um pull request.
