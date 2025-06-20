FROM oven/bun:latest
COPY package.json ./
COPY bun.lock ./
COPY src ./src
COPY Data ./data
COPY tsconfig.json ./
RUN bun install
RUN bun dev