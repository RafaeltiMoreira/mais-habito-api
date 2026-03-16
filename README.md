# 🌟 Mais Hábito API

> Uma API para gamificar a produtividade pessoal através de desafios e tarefas pontuadas

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)

---

## 📋 Sobre o Projeto

O Mais Hábito é uma aplicação backend single-player que ajuda o usuário a organizar sua rotina diária e criar novos hábitos por meio de um sistema de recompensas em pontos, gamificando o progresso de suas metas.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação** - Sistema completo com JWT e criptografia bcrypt
- 👤 **Perfis de Usuário** - Gerenciamento de conta, pontos, XP, sequências (streaks)
- 🎯 **Catálogo de Desafios** - Criação de modelos de desafios (Challenge Templates)
- 🏃 **Desafios Ativos** - Assuma desafios do catálogo, registre anotações de progresso e complete metas
- ✅ **Tarefas e Rotinas** - CRUD completo para planejamento diário livre de restrições
- 🏆 **Gamificação** - Ganhe pontos ao concluir desafios/tarefas e mantenha as chamas da sequência

---

## 🛠️ Tecnologias

### Core
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem com tipagem superset
- **Express 5** - Framework web backend

### Database
- **PostgreSQL** - Banco de dados relacional robusto
- **Knex.js** - Migrations e Query Builder
- **pg** - Driver para PostgreSQL

### Segurança & Infra
- **jsonwebtoken** / **bcrypt** - Segurança de Autenticação
- **node-cron** - Jobs agendados (cálculo de sequências/streaks)
- **cors**, **dotenv** - Configuração e segurança de rede

---

## 🚀 Como Iniciar

1. Clone o repositório (`git clone https://github.com/RafaeltiMoreira/mais-habito-api.git`)
2. Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente (Credenciais do PostgreSQL, chave do JWT, etc.)
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute as migrations no banco de dados para criar as tabelas:
   ```bash
   npm run migrate:dev
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A API estará rodando tipicamente em `http://localhost:3000`.

---

## 🔌 Principais Endpoints

- **`/api/auth`** - Login e Criação de Conta
- **`/api/user`** - Leitura e Atualização de Perfil de Usuário
- **`/api/challenge-templates`** - Catálogo de Desafios Modelos (CRUD)
- **`/api/user-challenges`** - Aceitar, Finalizar, Abandonar ou Salvar Notas
- **`/api/tasks`** - Sistema de planejamento diário ou tarefas avulsas (CRUD)
- **`/api/task-completions`** - Endpoint chave para ganho de XP/Pontos

---

## 🏗️ Arquitetura

O projeto foi organizado com foco em escalabilidade e manutenção simples utilizando o **padrão Controller-Service-Repository**:

- **Rotas:** Mapeamento de endpoints para Controllers
- **Middlewares:** Triagem de autenticação (`ensureAuthenticated`), parser de erros
- **Controllers:** Recepção do `req/res`, validação básica de parâmetros payload
- **Services:** Camada principal de regras de negócio (Validação de limites, gamificação)
- **Repositories:** Transações puras com o Knex.js, isolando a API principal de mudanças de BD

---

## 👨‍💻 Autor

**Rafael Moreira**
- GitHub: [@RafaeltiMoreira](https://github.com/RafaeltiMoreira)
