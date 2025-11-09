FROM node:18

# Crear carpeta de la app
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install

COPY . .

# Exponer el puerto del backend
EXPOSE 4001

# Comando de inicio
CMD ["npm", "start"]
