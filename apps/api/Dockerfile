# Контекст сборки — корень монорепо: сервису нужен и packages/contracts, и общий lock-файл.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
RUN npm ci --workspace @catalog/api --workspace @catalog/contracts --include-workspace-root

COPY packages/contracts packages/contracts
COPY apps/api apps/api
RUN npm run build --workspace @catalog/contracts \
  && npm run build --workspace @catalog/api

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
RUN npm ci --omit=dev --workspace @catalog/api --include-workspace-root \
  && npm cache clean --force

COPY --from=build /app/packages/contracts/dist packages/contracts/dist
COPY --from=build /app/apps/api/dist apps/api/dist

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD \
  node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/api/dist/main.js"]
