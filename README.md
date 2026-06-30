# Reparou — Front-end + Back-end separados

Projeto da disciplina de Programação de Software para Web.

Esta versão reorganiza o projeto para deixar o **front-end** e o **back-end** em pastas separadas, evitando a mistura de arquivos React/Vite com arquivos Node/Express.

## Estrutura do projeto

```txt
REPAROU 3.0/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── data/
│   │   └── db.json
│   ├── middlewares/
│   ├── models/
│   ├── scripts/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

- `frontend/`: aplicação React com Vite.
- `backend/`: API Node.js + Express com MongoDB Atlas, Passport e JWT.
- `backend/data/db.json`: dados iniciais usados pelo seed automático do MongoDB.

## Estado atual do back-end

O back-end usa **Node.js + Express + MongoDB Atlas** e **controle de acesso com Passport + JWT**.

Os dados são armazenados no MongoDB Atlas usando a variável `MONGO_URI`. As rotas privadas são protegidas por token JWT enviado no cabeçalho:

```txt
Authorization: Bearer <token>
```

As rotas principais da API foram mantidas:

```txt
/clientes
/lojistas
/lojas
/chats
/reviews
/denuncias
/agendamentos
/admins
/data
/api/health
```

Rotas de autenticação:

```txt
/auth/login
/auth/register/cliente
/auth/register/lojista
/auth/me
```

O MongoDB cria um campo interno `_id`, mas o projeto continua usando o campo `id` antigo nas rotas e no front-end para evitar quebrar telas existentes.

## Controle de acesso com JWT

O login é feito pelo back-end. Quando as credenciais estão corretas, o servidor devolve:

```json
{
  "user": { "id": "...", "role": "..." },
  "role": "cliente | lojista | admin",
  "token": "JWT_GERADO_PELO_BACKEND"
}
```

O front-end salva esse token no `localStorage` e o envia automaticamente nas chamadas protegidas.

Regras principais:

- visitantes sem login conseguem consultar lojas e avaliações públicas;
- cliente acessa somente seus próprios dados, chats, denúncias e agendamentos;
- lojista acessa seu próprio perfil, suas lojas, chats das suas lojas e seus agendamentos;
- administrador acessa os dados administrativos;
- criar, editar e excluir dados privados exige JWT válido;
- o back-end remove o campo `senha` das respostas;
- o acesso ao administrador deve ser feito pelo login normal, usando ID e senha. Não há botão de acesso rápido ao admin.

## Como configurar o MongoDB Atlas

No Atlas:

1. Crie uma conta ou faça login.
2. Crie um projeto.
3. Crie um cluster gratuito, se essa opção estiver disponível.
4. Crie um usuário de banco em **Database Access**.
5. Libere o IP em **Network Access**.

Para testes acadêmicos, é possível liberar:

```txt
0.0.0.0/0
```

Isso permite conexão de qualquer IP, o que facilita testes em outra máquina, mas é menos seguro. Use uma senha forte no usuário do banco.

## Como configurar o `.env` do back-end

Dentro da pasta `backend`, copie:

```txt
.env.example
```

E crie uma cópia chamada:

```txt
.env
```

O conteúdo deve seguir este modelo:

```env
PORT=5001
JWT_SECRET=SUA_CHAVE_SECRETA_JWT_AQUI
JWT_EXPIRES_IN=8h
MONGO_URI=mongodb://Reparou:SUA_SENHA_AQUI@ac-hbdhgqi-shard-00-00.mzxjhm8.mongodb.net:27017,ac-hbdhgqi-shard-00-01.mzxjhm8.mongodb.net:27017,ac-hbdhgqi-shard-00-02.mzxjhm8.mongodb.net:27017/reparou?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
```

Troque `SUA_SENHA_AQUI` pela senha real do usuário do Atlas.

O arquivo `backend/.env` **não deve ser enviado para o GitHub**, porque contém dados sensíveis. O repositório deve conter apenas o `backend/.env.example`.

## Como rodar o projeto

Abra dois terminais.

### Terminal 1: back-end

```bash
cd backend
npm install
npm run dev
```

O back-end deve iniciar em:

```txt
http://localhost:5001
```

Teste no navegador:

```txt
http://localhost:5001/api/health
```

Resposta esperada:

```json
{
  "status": "OK",
  "message": "Backend is running with MongoDB Atlas and JWT access control"
}
```

### Terminal 2: front-end

```bash
cd frontend
npm install
npm run dev
```

O front-end deve iniciar em:

```txt
http://localhost:5173
```

## Seed/importação dos dados iniciais

O back-end faz uma importação automática do arquivo `backend/data/db.json` quando conecta em um banco completamente vazio.

Na primeira vez que você rodar com um banco novo no Atlas, ele deve importar automaticamente:

- clientes;
- lojistas;
- lojas;
- chats;
- reviews;
- denúncias;
- agendamentos;
- admins.

Para forçar a importação novamente, apagando os dados atuais do banco e recriando tudo a partir de `backend/data/db.json`, rode dentro da pasta `backend`:

```bash
npm run seed:force
```

Use esse comando com cuidado, porque ele apaga os dados atuais das coleções do Reparou no banco configurado.

## Acessos de teste

- Cliente: CPF `11111111111`, senha `123`
- Cliente: CPF `77777777777`, senha `123`
- Lojista: CNPJ `22222222222222`, senha `123`
- Admin: ID `31415`, senha `123`

## Scripts úteis

Na pasta `frontend`:

```bash
npm run dev
npm run build
npm run preview
npm run docs
```

Na pasta `backend`:

```bash
npm run dev
npm start
npm run seed
npm run seed:force
```

## Observações importantes

- O banco está na nuvem pelo MongoDB Atlas.
- O back-end ainda precisa ser executado localmente com `npm run dev` dentro de `backend`.
- O front-end precisa ser executado localmente com `npm run dev` dentro de `frontend`.
- A senha real do Atlas deve ficar somente no arquivo local `backend/.env`.
- O `node_modules` não deve ser enviado ao GitHub.
