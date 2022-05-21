FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . ./
RUN npm run build

FROM nginx:mainline-alpine
WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build .