# 🎯 Quiz Counter-Strike

Uma plataforma interativa de quiz e apostas sobre Counter-Strike 2, onde jogadores podem testar seus conhecimentos, competir entre si e ganhar recompensas reais.

## 📝 Introdução / Conceito

Um site na área de quiz totalmente focado no universo do Counter-Strike 2. Os jogadores podem se registrar no site via Steam e participar de lobbies competitivos onde apostam moedas para testar seus conhecimentos sobre o jogo.

## 🚀 Funcionalidades Principais

### 👤 Sistema de Autenticação
- **Login via Steam**: Integração completa com a API da Steam
- **Perfil do Jogador**: Estatísticas, histórico de partidas e saldo de moedas
- **Ranking Global**: Classificação dos melhores jogadores

### 💰 Sistema de Moedas e Apostas
- **Múltiplas Formas de Pagamento**:
  - Dinheiro real (PayPal, cartão de crédito)
  - Criptomoedas (Bitcoin, Ethereum)
  - Skins de CS2 (integração com inventário Steam)
- **Sistema de Apostas**: Jogadores apostam moedas para entrar em lobbies
- **Comissão do Operador**: Porcentagem das apostas retida pela plataforma

### 🎮 Sistema de Lobbies
- **Criação de Lobbies**: Jogadores podem criar salas com diferentes valores de entrada
- **Capacidade**: Até 10 jogadores por lobby
- **Status em Tempo Real**: Visualização de lobbies disponíveis e em andamento
- **Chat Integrado**: Comunicação entre jogadores no lobby

### 📊 Sistema de Quiz
- **10 Perguntas por Rodada**: Formato de quiz competitivo
- **Timer por Pergunta**: Tempo limitado para responder
- **Dificuldade Progressiva**: Perguntas ficam mais difíceis ao longo da rodada
- **Alternativas**: 4 opções por pergunta, apenas uma correta

### 🏆 Sistema de Premiação
- **Distribuição de Prêmios**: O jogador com mais acertos leva as apostas dos outros
- **Desempate**: Em caso de empate, o tempo de resposta é considerado
- **Retirada de Prêmios**: Conversão de moedas em dinheiro real, cripto ou skins

## 📁 Estrutura do Projeto

```
cs2-quiz-platform/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos principais
├── js/
│   ├── main.js             # Arquivo principal da aplicação
│   ├── quiz.js             # Lógica do quiz
│   ├── multiplayer.js      # Sistema de lobbies e multiplayer
│   ├── questions.js        # Banco de perguntas
│   └── storage.js          # Gerenciamento de dados locais
├── cs2-quiz-platform/
│   ├── backend/
│   │   ├── middleware/     # Middlewares do Express
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── server.js       # Servidor principal
│   │   └── utils/          # Utilitários
│   └── package.json        # Dependências do projeto
├── assets/                 # Recursos estáticos
│   ├── images/             # Imagens e ícones
│   └── sounds/             # Efeitos sonoros
├── DEPLOYMENT.md           # Guia de implantação em produção
└── todo.md                 # Lista de tarefas do projeto
```
## 🎯 Banco de Perguntas

O sistema inclui **100 perguntas** sobre Counter-Strike 2, organizadas em formato de quiz competitivo:

### Categorias Disponíveis:
- **Armas e Equipamentos**: Estatísticas, padrões de spray, dano, etc.
- **Mapas e Callouts**: Localizações, estratégias específicas de mapas
- **Estratégia e Economia**: Táticas de equipe, gerenciamento de economia
- **Mecânicas de Jogo**: Movimento, recoil, granadas, wallbangs
- **Pro Scene**: Times profissionais, jogadores, torneios
- **História do CS**: Versões anteriores, atualizações importantes
- **Meta Atual**: Estratégias populares, formações, tendências

### Estrutura das Perguntas:
- Cada pergunta possui 4 alternativas (A, B, C, D)
- Apenas uma alternativa é correta
- Dificuldade progressiva ao longo da rodada
- Tempo limitado para resposta (30 segundos por pergunta)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5/CSS3**: Estrutura semântica e design responsivo
- **JavaScript ES6+**: Lógica do cliente e interatividade
- **React.js**: Biblioteca para construção da interface
- **Socket.io Client**: Comunicação em tempo real para lobbies
- **Steam Web API**: Autenticação e integração com perfil Steam
- **Web3.js**: Integração com carteiras de criptomoedas

### Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para API RESTful
- **MongoDB**: Banco de dados para perfis e histórico
- **Socket.io**: Comunicação em tempo real para lobbies
- **Passport.js**: Autenticação OAuth com Steam
- **Stripe/PayPal API**: Processamento de pagamentos
- **Crypto Payment Gateways**: Integração com criptomoedas

### Segurança
- **JWT**: Autenticação e autorização
- **HTTPS**: Comunicação segura
- **Helmet**: Proteção contra vulnerabilidades comuns
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação de Dados**: Prevenção contra injeção e XSS

## 🎮 Como Jogar

### Registro e Depósito:
1. Faça login usando sua conta Steam
2. Adicione moedas ao seu saldo através de:
   - Pagamento com cartão de crédito/débito
   - Transferência de criptomoedas
   - Troca de skins de CS2

### Participando de um Quiz:
1. Navegue até a seção de lobbies disponíveis
2. Entre em um lobby existente ou crie um novo
3. Defina o valor da aposta para criar um lobby
4. Aguarde até que o lobby esteja cheio (máx. 10 jogadores)
5. Responda às 10 perguntas no formato "Quem Quer Ser Milionário"
6. O jogador com mais respostas corretas ganha as apostas

### Saque de Prêmios:
1. Acesse seu perfil e selecione "Sacar Prêmios"
2. Escolha o método de saque (dinheiro real, cripto ou skins)
3. Siga as instruções para completar a transação

## 💻 Requisitos do Sistema

### Web (Navegador):
- Chrome 70+, Firefox 63+, Safari 12+, Edge 79+
- Conexão estável à internet
- JavaScript habilitado
- Conta Steam ativa

### Aplicativo Móvel (Futuro):
- Android 8.0+ ou iOS 13+
- 100MB de espaço disponível
- Conexão à internet
- Conta Steam vinculada

## ⌨️ Atalhos de Teclado

- **1-4**: Selecionar resposta (A-D)
- **Enter**: Confirmar resposta
- **Esc**: Sair do quiz (com confirmação)

## 🔒 Segurança e Conformidade

- **Verificação de Idade**: Conformidade com leis de apostas
- **Termos de Serviço**: Políticas claras sobre apostas e prêmios
- **Proteção de Dados**: Conformidade com GDPR e outras regulamentações
- **Jogo Responsável**: Ferramentas para limitar apostas e tempo de jogo
- **Transações Seguras**: Criptografia de ponta a ponta para pagamentos

## 🚀 Desenvolvimento

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/cs2-quiz-platform.git

# Instalar dependências do frontend
cd cs2-quiz-platform
npm install

# Instalar dependências do backend
cd cs2-quiz-platform
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar servidor de desenvolvimento
npm run dev
```

### Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## ⚠️ Aviso Legal

Este projeto é apenas para fins educacionais e de entretenimento. O uso real de sistemas de apostas pode estar sujeito a regulamentações locais. Os usuários são responsáveis por verificar a legalidade antes de implementar ou usar este sistema em um ambiente de produção.
- **Enter/Espaço**: Próxima pergunta
- **Escape**: Sair do quiz (com confirmação)
- **R**: Reiniciar quiz (na tela de resultados)

## 🏆 Sistema de Conquistas

- **🎯 Primeira Partida**: Complete seu primeiro quiz
- **💯 Pontuação Perfeita**: Acerte todas as perguntas
- **🔥 Em Chamas**: Sequência de 5 acertos
- **⚡ Imparável**: Sequência de 10 acertos
- **🏆 Veterano**: Complete 10 partidas
- **👑 Especialista**: Complete 50 partidas
- **🎖️ Mestre do Difícil**: 80%+ de precisão no modo difícil

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móveis (iOS/Android)

## 🔧 Configurações

O sistema oferece configurações personalizáveis:
- **Volume dos Efeitos**: Controle do volume dos sons
- **Efeitos Sonoros**: Ativar/desativar sons
- **Animações**: Ativar/desativar animações

## 💾 Armazenamento de Dados

Todos os dados são salvos localmente no navegador:
- Histórico de partidas
- Estatísticas pessoais
- Ranking de jogadores
- Configurações do usuário
- Sistema de conquistas

### Exportar/Importar Dados:
- Exporte seus dados para backup
- Importe dados de outro dispositivo
- Formato JSON compatível

## 🎨 Personalização

### Cores Temáticas:
- **Laranja CS2**: `#ff6b35`
- **Azul CS2**: `#1e3a8a`
- **Escuro**: `#0f172a`
- **Cinza**: `#334155`
- **Sucesso**: `#10b981`
- **Erro**: `#ef4444`

### Fontes:
- Sistema: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Fallbacks para máxima compatibilidade

## 🚀 Instalação e Uso

1. **Clone ou baixe** os arquivos do projeto
2. **Abra** o arquivo `index.html` em um navegador
3. **Comece a jogar** imediatamente!

Não é necessário servidor web ou instalação adicional.

## 🔮 Funcionalidades Futuras

- [ ] Modo online multiplayer
- [ ] Mais categorias de perguntas
- [ ] Sistema de clãs/equipes
- [ ] Torneios automatizados
- [ ] Integração com Steam
- [ ] Modo treino por categoria
- [ ] Perguntas com imagens
- [ ] Sistema de níveis/XP

## 🐛 Resolução de Problemas

### Problemas Comuns:

**Sons não funcionam:**
- Verifique se o navegador permite áudio
- Ative os efeitos sonoros nas configurações

**Dados perdidos:**
- Verifique se o LocalStorage está habilitado
- Use a função de exportar dados regularmente

**Layout quebrado:**
- Atualize o navegador
- Limpe o cache do navegador

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ para a comunidade CS2.

### Estrutura do Código:

- **Modular**: Cada funcionalidade em arquivo separado
- **Orientado a Objetos**: Classes para organização
- **Responsivo**: Mobile-first design
- **Acessível**: Suporte a leitores de tela
- **Performático**: Otimizado para velocidade

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Adicionar novas perguntas
- Melhorar o design
- Corrigir bugs
- Sugerir funcionalidades

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Divirta-se testando seus conhecimentos sobre Counter-Strike 2!** 🎯🔥