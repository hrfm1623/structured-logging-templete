# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@latest --activate

# 依存関係のインストール
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ソースコードのコピーとビルド
COPY . .
RUN pnpm build

# Production Stage
FROM node:20-slim

WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@latest --activate

# 本番用の依存関係のみをインストール
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ビルド成果物のコピー
COPY --from=builder /app/dist ./dist
COPY .env.example .env

# アプリケーションの起動
ENV NODE_ENV=production
EXPOSE 8080
CMD [ "node", "dist/main.js" ] 