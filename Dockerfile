# Dockerfile para desenvolvimento Angular com Hot Reload
FROM node:20-alpine

# Instala dependências necessárias
RUN apk add --no-cache git

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências incluindo devDependencies
RUN npm ci --include=dev

# Copia o código fonte
COPY . .

# Expõe a porta 4200
EXPOSE 4200

# Configura o Angular CLI para aceitar conexões externas e habilitar hot reload
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Comando para iniciar o servidor de desenvolvimento com hot reload e proxy
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000", "--live-reload", "true", "--watch", "--proxy-config", "proxy.conf.json"]


