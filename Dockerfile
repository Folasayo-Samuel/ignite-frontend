# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies for build
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output (much smaller than full .next)
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]


# # ---- deps ----
# FROM node:20-bookworm-slim AS deps
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci

# # ---- build ----
# FROM node:20-bookworm-slim AS build
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# # ---- runner ----
# FROM node:20-bookworm-slim AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# # Copy build artifacts
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/public ./public
# COPY --from=build /app/package*.json ./
# COPY --from=build /app/node_modules ./node_modules

# # non-root
# RUN useradd -u 1001 nextjs && chown -R nextjs:nextjs /app
# USER nextjs

# EXPOSE 3000
# CMD ["npm", "start"]






# # ---- deps ----
# FROM node:20-bookworm-slim AS deps
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci

# # ---- build ----
# FROM node:20-bookworm-slim AS build
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# # If you need build-time envs, set them in Actions as secrets and pass with --build-arg or env.
# RUN npm run build

# # ---- runner (Next standalone) ----
# FROM node:20-bookworm-slim AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# # If you used Next standalone output, copy it; else copy .next and public
# # Prefer standalone for smaller runtime:
# # npx next build should generate .next/standalone and .next/static on Next 13+
# COPY --from=build /app/public ./public
# # COPY --from=build /app/.next/standalone ./
# COPY --from=build /app/.next/static ./.next/static
# # non-root
# RUN useradd -u 1001 nextjs && chown -R nextjs:nextjs /app
# USER nextjs
# EXPOSE 3000
# CMD ["node", "server.js"]



# # FROM node:20-alpine as builder
# # WORKDIR /app
# # COPY . .
# # RUN npm install
# # RUN npm run build

# # FROM node:20-alpine
# # WORKDIR /app
# # COPY --from=builder /app .
# # EXPOSE 3000
# # CMD ["npm", "start"]
