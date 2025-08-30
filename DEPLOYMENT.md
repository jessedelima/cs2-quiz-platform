# 🚀 Guia de Implantação - CS2 Quiz Platform

Este documento contém instruções detalhadas para implantar a plataforma CS2 Quiz em ambiente de produção.

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- NPM ou Yarn
- Conta na plataforma de hospedagem escolhida
- Domínio registrado (opcional, mas recomendado)
- Chave de API Steam válida

## 🔧 Passo a Passo para Implantação

### 1️⃣ Configuração de Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`
2. Configure todas as variáveis necessárias para produção:
   ```
   # Configurações do Servidor
   PORT=3000 (ou a porta fornecida pelo serviço de hospedagem)
   NODE_ENV=production

   # Steam API
   STEAM_API_KEY=sua_steam_api_key_aqui
   STEAM_BOT_USERNAME=seu_bot_username
   STEAM_BOT_PASSWORD=sua_bot_password
   STEAM_BOT_SHARED_SECRET=seu_shared_secret
   STEAM_BOT_IDENTITY_SECRET=seu_identity_secret

   # Sessão
   SESSION_SECRET=gere_uma_chave_aleatoria_segura

   # Banco de Dados
   DATABASE_PATH=/caminho/absoluto/para/database/cs2quiz.db

   # URLs
   BASE_URL=https://seu-dominio.com
   FRONTEND_URL=https://seu-dominio.com

   # Configurações do Quiz
   MAX_PLAYERS_PER_LOBBY=10
   QUIZ_TIME_LIMIT=30
   QUESTIONS_PER_QUIZ=10
   PLATFORM_FEE_PERCENTAGE=5

   # Configurações de Skins
   MIN_SKIN_VALUE=1.00
   SKIN_PRICE_API=https://api.csgofloat.com/v1/market/items
   ```

### 2️⃣ Escolha e Configuração do Serviço de Hospedagem

#### Opção 1: Heroku

1. Crie uma conta no [Heroku](https://heroku.com)
2. Instale o Heroku CLI: `npm install -g heroku`
3. Faça login: `heroku login`
4. Crie um novo app: `heroku create cs2-quiz-platform`
5. Adicione o remote do Heroku: `heroku git:remote -a cs2-quiz-platform`
6. Configure as variáveis de ambiente no dashboard do Heroku ou via CLI:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set STEAM_API_KEY=sua_chave
   # Adicione todas as outras variáveis
   ```
7. Faça deploy: `git push heroku main`

#### Opção 2: DigitalOcean App Platform

1. Crie uma conta no [DigitalOcean](https://digitalocean.com)
2. No dashboard, vá para "Apps" e clique em "Create App"
3. Conecte seu repositório GitHub/GitLab
4. Configure as variáveis de ambiente
5. Selecione o plano de hospedagem
6. Clique em "Launch App"

#### Opção 3: AWS Elastic Beanstalk

1. Crie uma conta na [AWS](https://aws.amazon.com)
2. Instale o AWS CLI e o EB CLI
3. Configure suas credenciais: `aws configure`
4. Inicialize o EB: `eb init`
5. Crie um ambiente: `eb create cs2-quiz-production`
6. Configure as variáveis de ambiente no console da AWS
7. Faça deploy: `eb deploy`

### 3️⃣ Configuração de Domínio e SSL

1. Registre um domínio (Namecheap, GoDaddy, etc.)
2. Configure os registros DNS para apontar para seu servidor:
   - Tipo: A ou CNAME
   - Nome: @ ou www
   - Valor: IP ou URL fornecido pelo serviço de hospedagem
3. Configure SSL:
   - No Heroku: `heroku certs:auto`
   - No DigitalOcean: Ative a opção "Automatically secure HTTP connections"
   - No AWS: Configure o Certificate Manager e o Load Balancer

### 4️⃣ Configuração do Banco de Dados

#### SQLite (para projetos pequenos)

1. Certifique-se de que o diretório do banco de dados tenha permissões de escrita
2. Configure backups regulares

#### Migração para PostgreSQL/MySQL (recomendado para produção)

1. Instale o driver adequado: `npm install pg` ou `npm install mysql2`
2. Modifique os arquivos de conexão com o banco de dados
3. Execute migrações: `npm run migrate`

### 5️⃣ Monitoramento e Logging

1. Configure o New Relic ou Datadog para monitoramento
2. Implemente Winston ou Bunyan para logging
3. Configure alertas para eventos críticos

### 6️⃣ Backups Automáticos

1. Configure backups diários do banco de dados
2. Armazene backups em local seguro (S3, Google Cloud Storage)
3. Teste o processo de restauração regularmente

### 7️⃣ Testes Finais

1. Teste de carga: Use ferramentas como k6, Apache JMeter
2. Teste de segurança: Execute OWASP ZAP ou similar
3. Verifique a responsividade em diferentes dispositivos

### 8️⃣ Configuração de CI/CD (opcional)

1. Configure GitHub Actions ou GitLab CI
2. Crie pipelines para testes automáticos
3. Configure deploy automático para ambientes de staging e produção

## 📈 Escalabilidade

### Estratégias para Crescimento

1. Implemente cache (Redis)
2. Configure balanceamento de carga
3. Considere arquitetura de microserviços para componentes críticos
4. Utilize CDN para conteúdo estático

## 🛠️ Manutenção

1. Monitore regularmente o desempenho
2. Atualize dependências periodicamente
3. Realize backups frequentes
4. Mantenha registros de alterações

## 🆘 Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com a API da Steam**
   - Verifique se a chave API é válida
   - Confirme se o bot Steam está online

2. **Problemas de desempenho**
   - Verifique o uso de recursos (CPU, memória)
   - Analise logs para identificar gargalos

3. **Falhas no banco de dados**
   - Verifique permissões de arquivo/diretório
   - Confirme espaço em disco disponível

---

Em caso de dúvidas ou problemas durante a implantação, consulte a documentação oficial das ferramentas utilizadas ou entre em contato com a equipe de desenvolvimento.