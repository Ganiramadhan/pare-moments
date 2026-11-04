# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS build

ARG PNPM_VERSION=10.12.1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# Dependencies first, so this layer is reused until package.json or the lockfile changes.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

ARG VITE_SITE_URL=http://localhost:3305
ENV VITE_SITE_URL=${VITE_SITE_URL}
ARG VITE_ENABLE_UPLOADS=false
ENV VITE_ENABLE_UPLOADS=${VITE_ENABLE_UPLOADS}

COPY . .
RUN pnpm build

# ---- Serve: static files behind nginx ----
FROM nginx:1.27-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3305

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3305/ || exit 1
