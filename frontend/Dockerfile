
FROM node AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod


FROM nginx
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
EXPOSE 443
EXPOSE 80
