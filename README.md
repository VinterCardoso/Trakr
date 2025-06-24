# Trakr
Projeto desenvolvido na matéria de Banco de Dados

# Tecnologias utilizadas
O repositório foi criado utilizando Typescript e o banco de dados escolhido foi MySQL.

Um docker-compose.yml está disponível na raiz do projeto para facilitar o desenvolvimento, não necessitando muitas configurações para acessar o banco.

Para back-end foram utilizados:
- Express
- Prisma

# Primeiros passos
- Instalar o node 20.10.0
- Instalar docker e docker compose
- Instalar dependencias utilizando o comando ```yarn```
- Criar o arquivo ```.env``` na pasta raiz do projeto baseados no arquivo ```env.example```
- Na raiz do projeto utilizar o comando ```docker compose up``` para disponibilizar o banco
- Após o banco estar rodando, execute o comando npx prisma migrate dev --name init para aplicar as migrações e criar o esquema do banco de dados
- Em seguida, execute o comando npx prisma generate para gerar o Prisma Client
- Utilizar o comando yarn dev para disponibilizar o serviço na máquina local

# Opcional:

- Para visualizar e gerenciar os dados do banco de dados através de uma interface web, utilize o comando npx prisma studio
