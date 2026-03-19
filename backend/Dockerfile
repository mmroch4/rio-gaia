# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

# ── Stage 2: Build ──
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarnrc.yml ./
COPY . .
RUN yarn build
# Patch: meilisearch dependency is missing from build output
RUN cd .medusa/server && \
    node -e "const p=require('./package.json'); p.dependencies.meilisearch='^0.55.0'; require('fs').writeFileSync('./package.json', JSON.stringify(p, null, 2))"

# ── Stage 3: Production ──
FROM node:20-alpine AS runner
RUN corepack enable
WORKDIR /app

RUN addgroup --system --gid 1001 medusa && \
    adduser --system --uid 1001 medusa

# Copy built app
COPY --from=builder --chown=medusa:medusa /app/.medusa ./.medusa
COPY --from=builder --chown=medusa:medusa /app/package.json ./

# Install production dependencies for the build output
RUN cd .medusa/server && yarn install --immutable 2>/dev/null || yarn install

USER medusa
EXPOSE 9000

ENTRYPOINT ["sh", "-c"]
CMD ["if [ \"$MEDUSA_WORKER_MODE\" = \"server\" ]; then cd .medusa/server && npx medusa db:migrate && npx medusa start; else cd .medusa/server && npx medusa start; fi"]
