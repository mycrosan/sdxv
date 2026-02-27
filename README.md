# CaixaVerso Angular

Aplicação bancária de demonstração construída com Angular 19, com foco em:

- Painel principal com saldo e transações
- Extrato
- Transferências
- Simulação e solicitação de crédito

## Tecnologias

- Angular 19
- Angular Material
- Bootstrap
- `json-server` (API fake local)
- `ngx-mask` (máscaras de input)

## Pré-requisitos

- Node.js 18+ (recomendado)
- npm

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie aplicação e API fake juntos:

```bash
npm start
```

3. Acesse no navegador:

`http://localhost:4200`

## Scripts disponíveis

- `npm start`: sobe frontend Angular e API fake (`json-server`) ao mesmo tempo
- `npm run api`: sobe somente a API fake na porta `3000`
- `npm run build`: gera build de produção em `dist/`
- `npm run watch`: build em modo observação (desenvolvimento)
- `npm test`: executa testes unitários

## API fake

Os dados locais ficam em:

- `api/db.json`

Ao rodar `npm run api`, os endpoints principais ficam disponíveis em:

- `GET /account`
- `GET /transactions`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`
- `GET /loans`
- `POST /loans`
- `PATCH /account`

Base URL padrão:

- `http://localhost:3000`

## Acesso (login)

- CPF: `000.000.000-00`
- Senha: qualquer valor

## Estrutura principal

- `src/app/main-panel`: painel inicial
- `src/app/pages/login`: login
- `src/app/pages/extrato`: extrato
- `src/app/pages/transferencias`: transferências
- `src/app/pages/credito`: crédito
- `src/app/core/service/api.service.ts`: integração com API fake

## Observações

- Projeto com SSR configurado pelo Angular.
- Algumas animações e estilos são definidos globalmente em `src/styles.scss`.
