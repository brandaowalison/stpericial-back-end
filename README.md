# STPericial - Back-End

Back-end do Projeto Integrador desenvolvido com Node.js, responsável por gerenciamento de Casos Periciais.

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para Node.js.
- **MongoDB**: Banco de dados NoSQL.
- **Mongoose**: ODM para MongoDB.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **PDFKit**: Geração de arquivos PDF.
- **Crypto**: Assinatura e verificação digital.
- **Swagger**: Documentação interativa da API.
- **Multer**: Para lidar com arquivos do tipo multipart/form-data.
- **Cors**: Para fornecer um middleware de conexão.

## 📁 Estrutura do Projeto

```
stpericial-back-end/
├── keys/                  # Chaves privadas e públicas para assinatura digital
├── src/
|   ├── controllers/       # Lógica dos endpoints
│   ├── db/                # Conexão com o Banco
│   ├── docs/              # Documentação do Swagger
|   ├── models/            # Modelos do Mongoose
|   ├── middlewares/       # Autenticação e Upload
│   ├── routes/            # Definição das rotas da API
│   ├── utils/             # Funções utilitárias (ex: assinatura.js e cloudinary.js)
├── .env.example           # Exemplo de variáveis de ambiente
├── server.js              # Ponto de entrada da aplicação
├── package.json           # Dependências e scripts
```

## ⚙️ Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/brandaowalison/stpericial-back-end.git
   cd stpericial-back-end
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Renomeie o arquivo `.env.example` para `.env` e ajuste os valores conforme necessário:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/stpericial
   PRIVATE_KEY_PATH=keys/private.pem
   PUBLIC_KEY_PATH=keys/public.pem
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   ```

4. **Inicie o servidor:**

   ```bash
   npm start
   ```

   O servidor estará disponível em `http://localhost:3000`.

## 📄 Documentação da API

A documentação interativa da API está disponível via Swagger em:

```
https://stpericial-back-end.onrender.com/api-docs
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.
