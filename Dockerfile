# Etapa de construcción
FROM node:14 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación y las dependencias
COPY package*.json ./
RUN npm install
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos de la aplicación construida desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 para el servidor Nginx
EXPOSE 80

# Comando por defecto para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
