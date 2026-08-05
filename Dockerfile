FROM node:22-alpine AS builder
ARG VERSION
WORKDIR /remio-home

COPY . .

RUN npm install -g pnpm && pnpm i --frozen-lockfile
ENV VERSION=${VERSION}
RUN pnpm build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

COPY --from=builder /remio-home/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

EXPOSE 80

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]