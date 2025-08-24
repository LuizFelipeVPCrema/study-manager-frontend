# Frontend Service - Study Manager

Interface moderna e elegante para o sistema de gerenciamento de estudos, desenvolvida em Angular 17.

## 🎨 Características

- **Design Moderno**: Interface limpa e elegante com gradientes e animações
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Dark Mode**: Suporte automático para modo escuro
- **Segurança**: Sistema de autenticação com JWT e guards de proteção
- **Performance**: Lazy loading de componentes e otimizações

## 🏗️ Arquitetura

```
src/app/
├── guards/                 # Guards de autenticação
├── pages/                  # Páginas da aplicação
│   ├── login/             # Tela de login
│   ├── register/          # Tela de registro
│   └── dashboard/         # Dashboard principal
│       ├── overview/      # Visão geral
│       ├── study-plans/   # Planos de estudo
│       ├── notes/         # Anotações
│       ├── bibliography/  # Bibliografia
│       ├── files/         # Arquivos
│       └── profile/       # Perfil do usuário
├── services/              # Serviços de comunicação
│   ├── auth.service.ts    # Autenticação
│   └── study-manager.service.ts # API do Study Manager
└── app.routes.ts          # Configuração de rotas
```

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Registro de novos usuários
- Tokens JWT para segurança
- Proteção de rotas com guards

### 📊 Dashboard
- Visão geral com estatísticas
- Navegação lateral responsiva
- Cards informativos com animações
- Ações rápidas para tarefas comuns

### 📚 Módulos (Em desenvolvimento)
- **Planos de Estudo**: Criação e gerenciamento de planos
- **Anotações**: Sistema de notas e anotações
- **Bibliografia**: Gerenciamento de referências
- **Arquivos**: Upload e organização de arquivos
- **Perfil**: Configurações do usuário

## 🎨 Design System

### Cores
- **Primária**: `#667eea` (Azul)
- **Secundária**: `#764ba2` (Roxo)
- **Sucesso**: `#43e97b` (Verde)
- **Aviso**: `#f093fb` (Rosa)
- **Info**: `#4facfe` (Azul claro)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

### Componentes
- Cards com sombras e bordas arredondadas
- Botões com gradientes e hover effects
- Inputs com ícones e validação
- Sidebar colapsável
- Animações suaves

## 🛠️ Tecnologias

- **Angular 17**: Framework principal
- **TypeScript**: Linguagem de programação
- **SCSS**: Pré-processador CSS
- **Angular Router**: Navegação
- **Angular HttpClient**: Comunicação com APIs
- **Angular Signals**: Gerenciamento de estado

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações
- Sidebar colapsável em mobile
- Cards em grid responsivo
- Tipografia escalável
- Touch-friendly buttons

## 🔧 Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
cd frontend-service
npm install
```

### Desenvolvimento
```bash
npm start
```

### Build
```bash
npm run build
```

## 🌐 Comunicação com APIs

### Auth Service (Porta 8081)
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Refresh token

### Study Manager Service (Porta 8080)
- `GET /api/v1/study-plans` - Listar planos
- `POST /api/v1/study-plans` - Criar plano
- `GET /api/v1/notes` - Listar anotações
- `POST /api/v1/notes` - Criar anotação
- `GET /api/v1/bibliography` - Listar referências
- `POST /api/v1/bibliography` - Adicionar referência
- `GET /api/v1/files` - Listar arquivos
- `POST /api/v1/files/upload` - Upload de arquivo

## 🔒 Segurança

### Autenticação
- Tokens JWT armazenados no localStorage
- Refresh automático de tokens
- Guards de proteção de rotas
- Interceptors para adicionar headers de autorização

### Validação
- Validação de formulários
- Sanitização de inputs
- Proteção contra XSS
- CORS configurado

## 🎯 Próximos Passos

### Funcionalidades Planejadas
1. **Planos de Estudo**
   - Criação de planos
   - Cronograma visual
   - Progresso tracking

2. **Sistema de Anotações**
   - Editor rico de texto
   - Tags e categorização
   - Busca avançada

3. **Bibliografia**
   - Importação automática
   - Formatação ABNT
   - Exportação

4. **Gerenciamento de Arquivos**
   - Upload múltiplo
   - Preview de arquivos
   - Organização por pastas

5. **Perfil do Usuário**
   - Configurações
   - Preferências
   - Estatísticas pessoais

### Melhorias Técnicas
- PWA (Progressive Web App)
- Offline support
- Push notifications
- Performance optimizations
- Unit tests
- E2E tests

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia servidor de desenvolvimento
npm run build      # Build de produção
npm run test       # Executa testes
npm run lint       # Verifica código
npm run format     # Formata código

# Docker
npm run docker:build    # Build da imagem Docker
npm run docker:run      # Executa container
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
