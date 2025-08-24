# Dockerfile para desenvolvimento Angular
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências incluindo devDependencies
RUN npm ci --include=dev

# Copia o código fonte
COPY . .

# Expõe a porta 4000 (porta configurada no comando)
EXPOSE 4000

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4000"]


