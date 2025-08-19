# 🎯 Quiz CS2 - Sistema Completo de Quiz sobre Counter-Strike 2

Um sistema interativo e moderno de quiz sobre Counter-Strike 2, desenvolvido em HTML, CSS e JavaScript puro, com funcionalidades avançadas e design responsivo.

## 🚀 Funcionalidades Principais

### 🎮 Modos de Jogo
- **Modo Fácil**: Perguntas básicas sobre CS2, ideal para iniciantes
- **Modo Médio**: Desafios intermediários para jogadores experientes  
- **Modo Difícil**: Para verdadeiros especialistas em CS2
- **Modo Competitivo**: Perguntas sobre estratégias profissionais e meta atual
- **Modo Multiplayer**: Jogue com até 4 amigos localmente (turnos ou simultâneo)

### 📊 Sistema de Pontuação Avançado
- Pontuação baseada na dificuldade da pergunta
- Bônus por tempo de resposta
- Bônus por sequência de acertos
- Sistema de conquistas e medalhas
- Ranking global de jogadores

### ⏱️ Timer Dinâmico
- Timer adaptativo baseado na dificuldade
- Indicador visual circular com animações
- Efeitos sonoros e visuais quando o tempo está acabando

### 🏆 Sistema de Estatísticas
- Histórico completo de partidas
- Estatísticas por categoria e dificuldade
- Precisão geral e categoria favorita
- Sistema de conquistas desbloqueáveis
- Exportação/importação de dados

### 🎨 Design Moderno
- Interface inspirada no visual do CS2
- Cores e gradientes temáticos
- Animações suaves e responsivas
- Compatível com dispositivos móveis
- Modo escuro por padrão

## 📁 Estrutura do Projeto

```
quiz-cs2/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos principais
├── js/
│   ├── main.js            # Arquivo principal da aplicação
│   ├── quiz.js            # Lógica do quiz
│   ├── questions.js       # Banco de perguntas
│   ├── storage.js         # Sistema de armazenamento
│   └── multiplayer.js     # Modo multiplayer
├── data/                  # Dados adicionais (futuro)
├── img/                   # Imagens (futuro)
└── README.md             # Documentação
```

## 🎯 Banco de Perguntas

O sistema inclui **40 perguntas** distribuídas em 4 níveis de dificuldade:

### Categorias Disponíveis:
- **Armas**: AK-47, M4A4, AWP, pistolas, etc.
- **Mapas**: Dust2, Mirage, Inferno, callouts, etc.
- **Estratégia**: Táticas, economia, posicionamento
- **Mecânicas**: Recoil, timing, movimento
- **Pro Scene**: Jogadores profissionais, torneios
- **Meta**: Estratégias atuais, formações

### Distribuição por Dificuldade:
- **Fácil**: 10 perguntas (10 pontos cada)
- **Médio**: 10 perguntas (15 pontos cada)
- **Difícil**: 10 perguntas (20 pontos cada)
- **Competitivo**: 10 perguntas (25 pontos cada)

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, animações, variáveis CSS
- **JavaScript ES6+**: Classes, modules, async/await
- **LocalStorage**: Persistência de dados local
- **Web Audio API**: Efeitos sonoros
- **Responsive Design**: Mobile-first approach

## 🎮 Como Jogar

### Modo Single Player:
1. Digite seu nome na tela inicial
2. Escolha o nível de dificuldade
3. Responda as 10 perguntas no tempo limite
4. Veja seus resultados e estatísticas

### Modo Multiplayer:
1. Clique em "Modo Multiplayer"
2. Adicione de 2 a 4 jogadores
3. Escolha entre modo "Por Turnos" ou "Simultâneo"
4. Selecione a dificuldade
5. Compitam pelas melhores pontuações!

## ⌨️ Atalhos de Teclado

- **1-4**: Selecionar resposta (A-D)
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