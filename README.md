# API REST — Demo Sanitizada

> **Este repositório é uma versão demonstrativa e sanitizada de um sistema backend em desenvolvimento comercial ativo.**
>
> Lógicas proprietárias, nomes de infraestrutura, configurações de ambiente e detalhes sensíveis do domínio foram renomeados, simplificados, omitidos ou removidos por questões de segurança e contrato. O que permanece é a estrutura arquitetural, os padrões de código e as decisões técnicas que refletem o sistema real.

---

## Contexto

Esta API faz parte de um produto real em desenvolvimento — uma plataforma digital de acompanhamento obstétrico que conecta gestantes aos seus médicos obstetras ao longo das 40 semanas de gestação.

O backend foi projetado para suportar essa arquitetura multi-role e multi-plataforma desde o início, com segurança e sensibilidade dos dados como preocupações centrais — dado que a plataforma lida com dados sensíveis de saúde sujeitos à **LGPD**.

### O que o sistema real contempla

Além do que está nesta demo, o sistema real inclui módulos como:

- **Ficha médica** 
- **Diário**
- **Consultas**
- **Artigos informativos**
- **Notificações**
- **Convites**

Entre outras funcionalidades.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 18+ (ES Modules) |
| Framework | Express |
| Banco de Dados + Auth | Supabase (PostgreSQL + Auth) |
| Validação | Zod |
| Documentação | Swagger / OpenAPI 3.0 |
| Upload de Arquivos | Multer + Supabase Storage |

---

## Estrutura do Projeto

Vários arquivos foram removidos ou tiveram seu código omitido.

```
src/
├── config/
│   ├── constants.js
│   ├── database.js
│   └── swagger.js
├── controllers/
│   ├── auth.controller.js
│   ├── pregnancies.controller.js
│   ├── profiles.controller.js
│   ├── patient/
│   │   └── diaryEntries.controller.js
│   ├── doctor/
│   │   └── diaryEntries.controller.js
│   └── admin/
│       └── content.controller.js
├── middlewares/
│   ├── authenticate.js
│   ├── authorize.js
│   └── errorHandler.js
├── routes/
│   ├── auth.routes.js
│   ├── pregnancies.routes.js
│   ├── profiles.routes.js
│   ├── patient/
│   │   ├── diaryEntries.routes.js
│   │   └── index.js
│   ├── doctor/
│   │   ├── diaryEntries.routes.js
│   │   └── index.js
│   └── admin/
│       ├── content.routes.js
│       └── index.js
├── schemas/
│   ├── auth.schema.js
│   ├── common.schema.js
│   ├── diary.schema.js
│   ├── profiles.schema.js
│   ├── admin/content.schema.js
│   ├── patient/
│   │   └── pregnancies.schema.js
│   └── admin/
│       └── content.schema.js
├── utils/
│   ├── errors.js
│   ├── gestationalAge.js
│   ├── validate.js
│   └── storage.js
└── app.js
```

---

## Decisões de Arquitetura

### Segregação de rotas por role

Cada perfil de usuário possui seu próprio namespace de rotas com autenticação e autorização aplicadas no nível do grupo — sem repetição em cada rota individual:

```js
app.use("/api/patient", authenticate, authorize("patient"), patientRoutes);
app.use("/api/doctor",  authenticate, authorize("doctor"),  doctorRoutes);
app.use("/api/admin",   authenticate, authorize("admin"),   adminRoutes);
```

### Endpoints de autenticação separados por plataforma

Login e signup são separados por plataforma. O servidor decide quais roles podem autenticar em cada contexto — uma paciente não consegue autenticar no painel do médico e vice-versa. Se um mismatch de role for detectado após a autenticação, a sessão é imediatamente invalidada antes de retornar o erro:

### Controle de acesso em três camadas

| Camada | Responsabilidade |
|---|---|
| Middleware (`authorize`) | Nível de rota: quem pode acessar o endpoint |
| RLS (PostgreSQL) | Nível de linha: quais registros o usuário pode ler ou escrever |
| Controller | Nível de coluna: quais campos são retornados por role |

## Padrões Demonstrados

- **Tratamento centralizado de erros** — todos os erros propagam via `next(error)` para um único handler; controllers nunca formatam respostas de erro diretamente
- **Classes de erro customizadas** — `ValidationError`, `NotFoundError`, `ForbiddenError` mapeiam diretamente para códigos HTTP
- **Validação com Zod** e helper `validate()` reutilizável que produz mensagens de erro por campo de forma consistente
- **Soft delete** em todas as entidades de conteúdo — nada é removido fisicamente, `is_active` controla visibilidade
- **Operações idempotentes** — ex: marcar como lido usa `upsert` com tratamento de conflito
- **URLs assinadas** para buckets privados — arquivos sensíveis (fotos de ultrassom, diário) nunca são servidos por URL pública
- **Utilitários de domínio desacoplados** — cálculos de semana gestacional vivem em `utils/` e são reutilizados em múltiplos módulos
- **Reuso de schemas** com `schema.partial()` para endpoints de atualização parcial

---

## Rodando Localmente

```bash
npm install
cp .env.example .env
# Preencha com suas credenciais
npm run dev
```

Swagger UI disponível em `http://localhost:3000/api/docs`.

---

## Variáveis de Ambiente

```env
PORT=3000
NODE_ENV=development

DB_URL=sua_url_do_banco
DB_KEY=sua_anon_key
DB_SERVICE_KEY=sua_service_role_key
```

---

## O que foi omitido ou alterado

Para proteger o produto comercial do qual este código é originado:

- Nomes de tabelas, colunas e módulos específicos do domínio foram renomeados para equivalentes genéricos
- Lógicas proprietárias (cálculos clínicos, fluxo de convites, integrações externas) foram removidas ou substituídas
- URLs de serviços reais, nomes de buckets e identificadores de ambiente foram substituídos
- Alguns módulos presentes na API oficial não estão incluídos neste repositório
