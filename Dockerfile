# syntax=docker/dockerfile:1

# ---- Build: install dependencies and make the production bundle ----
FROM node:22-bookworm-slim AS build

# Keep in sync with the pnpm version that created pnpm-lock.yaml.
ARG PNPM_VERSION=10.12.1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# Dependencies first, so this layer is reused until package.json or the lockfile changes.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# The public address of the website (share preview, sitemap, canonical links). Pass the real one:
#   docker build --build-arg VITE_SITE_URL=https://your-domain.com -t pare-moments .
ARG VITE_SITE_URL=http://localhost:3305
ENV VITE_SITE_URL=${VITE_SITE_URL}
# Friends' uploads stay closed until the backend exists (true opens the Share page and the wall).
ARG VITE_ENABLE_UPLOADS=false
ENV VITE_ENABLE_UPLOADS=${VITE_ENABLE_UPLOADS}

COPY . .
# Type-checks, then builds into /app/dist.
RUN pnpm build

# ---- Serve: static files behind nginx ----
FROM nginx:1.27-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3305

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3305/ || exit 1
