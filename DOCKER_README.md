# Docker para Frontend Angular

Este projeto inclui configurações Docker para desenvolvimento e produção do frontend Angular.

## Arquivos Criados

- `Dockerfile` - Para build de produção
- `Dockerfile.dev` - Para ambiente de desenvolvimento
- `docker-compose.yml` - Orquestração dos serviços
- `.dockerignore` - Arquivos ignorados no build

## Como Usar

### Produção

Para build e execução em produção:

```bash
# Build da imagem
docker build -t frontend-service .

# Executar o container
docker run -p 4000:4000 frontend-service

# Ou usar docker-compose
docker-compose up --build
```

### Desenvolvimento

Para ambiente de desenvolvimento:

```bash
# Usar docker-compose com perfil de desenvolvimento
docker-compose --profile dev up --build

# Ou build manual
docker build -f Dockerfile.dev -t frontend-service-dev .
docker run -p 4200:4200 -v $(pwd):/app frontend-service-dev
```

## Características

### Dockerfile (Produção)
- **Multi-stage build** para otimizar o tamanho da imagem
- **Node.js 20 Alpine** para menor tamanho
- **Usuário não-root** para segurança
- **SSR habilitado** (Server-Side Rendering)
- **Porta 4000** exposta

### Dockerfile.dev (Desenvolvimento)
- **Volume mounting** para hot-reload
- **Todas as dependências** instaladas
- **Porta 4200** para Angular dev server
- **Usuário não-root** para segurança

### Docker Compose
- **Health checks** configurados
- **Restart policy** automático
- **Variáveis de ambiente** configuradas
- **Perfis** para diferentes ambientes

## Comandos Úteis

```bash
# Ver logs
docker-compose logs -f frontend

# Parar serviços
docker-compose down

# Rebuild sem cache
docker-compose build --no-cache

# Executar apenas produção
docker-compose up frontend

# Executar apenas desenvolvimento
docker-compose --profile dev up frontend-dev
```

## Variáveis de Ambiente

- `NODE_ENV`: production/development
- `PORT`: 4000 (produção) / 4200 (desenvolvimento)

## Portas

- **4000**: Servidor SSR de produção
- **4200**: Servidor de desenvolvimento

## Segurança

- Usuário não-root (`angular:1001`)
- `dumb-init` para gerenciamento de processos
- Imagem Alpine Linux para menor superfície de ataque


