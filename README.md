# Trakr

[![licença](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Tabela de Conteúdos

* [Visão Geral](#visao-geral)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Estrutura de Pastas](#estrutura-de-pastas)
* [Pré-requisitos](#pre-requisitos)
* [Começando](#comecando)
* [Scripts Disponíveis](#scripts-disponiveis)
* [Endpoints da API](#endpoints-da-api)
* [Banco de Dados](#banco-de-dados)
* [Contribuindo](#contribuindo)

## Visão Geral

Trakr é um projeto de sistema de rastreamento de despesas, desenvolvido como parte da disciplina de Banco de Dados. A aplicação permite aos usuários gerenciar suas compras, despesas, métodos de pagamento e muito mais.

## Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

* **Backend:**
    * [TypeScript](https://www.typescriptlang.org/)
    * [Node.js](https://nodejs.org/)
    * [Express](https://expressjs.com/)
    * [Prisma](https://www.prisma.io/)

* **Banco de Dados:**
    * [MySQL](https://www.mysql.com/)

* **Ambiente de Desenvolvimento:**
    * [Docker](https://www.docker.com/)
    * [Docker Compose](https://docs.docker.com/compose/)

## Estrutura de Pastas

A estrutura de pastas do projeto está organizada da seguinte forma:

rakr/
├── prisma/
│   └── migrations/
│       └── ...
├── src/
│   ├── infra/
│   │   └── database.ts
│   ├── modules/
│   │   ├── user/
│   │   ├── category/
│   │   ├── paymentMethod/
│   │   └── purchaseLocation/
│   ├── app.ts
│   ├── routes.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package.json
└── README.md


## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

* [Node.js](https://nodejs.org/) (versão 20.10.0 ou superior)
* [Yarn](https://yarnpkg.com/) (ou npm)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Começando

Siga as instruções abaixo para configurar e executar o projeto em sua máquina local.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/vintercardoso/trakr.git](https://github.com/vintercardoso/trakr.git)
    cd trakr
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    * Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    * Preencha as variáveis de ambiente necessárias no arquivo `.env`.

4.  **Inicie o contêiner do Docker:**
    * Para iniciar o banco de dados MySQL, execute o seguinte comando:
        ```bash
        docker-compose up -d
        ```

5.  **Execute as migrações do banco de dados:**
    * Para criar as tabelas do banco de dados, execute o seguinte comando:
        ```bash
        npx prisma migrate dev --name init
        ```

6.  **Gere o Prisma Client:**
    * Execute o seguinte comando para gerar o Prisma Client:
        ```bash
        npx prisma generate
        ```

7.  **Inicie o servidor de desenvolvimento:**
    * Para iniciar a aplicação, execute o seguinte comando:
        ```bash
        yarn dev
        ```

## Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

* `"dev"`: Inicia o servidor de desenvolvimento com o `tsx`.
* `"build"`: Compila o código TypeScript para JavaScript.
* `"prisma:migrate"`: Executa as migrações do banco de dados.
* `"prisma:generate"`: Gera o Prisma Client.

## Endpoints da API

A API expõe os seguintes endpoints:

* **Usuários:** `/api/users`
* **Categorias:** `/api/categories`
* **Métodos de Pagamento:** `/api/payment-methods`
* **Locais de Compra:** `/api/purchase-locations`

Para mais detalhes sobre as rotas, consulte os arquivos de rotas no diretório `src/modules`.

## Banco de Dados

O projeto utiliza o **MySQL** como banco de dados, com o **Prisma** como ORM para gerenciar o esquema e as consultas.

Para visualizar e gerenciar os dados do banco de dados, você pode usar o Prisma Studio com o seguinte comando:

```bash
npx prisma studio
```