# ** --- base stage ---
FROM node:21-alpine3.18 AS base

# ** --- builder stage ---
FROM base AS builder

WORKDIR /build

ARG NEXT_PUBLIC_BASE_ENDPOINT
ENV NEXT_PUBLIC_BASE_ENDPOINT=$NEXT_PUBLIC_BASE_ENDPOINT


COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

# ** --- runner stage ---
FROM builder AS runner

WORKDIR /app

COPY --from=builder /build/package.json  .
COPY --from=builder /build/package-lock.json  .
# COPY --from=builder /build/node_modules  ./node_modules
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/public  ./public

RUN npm install --omit=dev

EXPOSE 3000

CMD [ "npm", "run", "start" ]