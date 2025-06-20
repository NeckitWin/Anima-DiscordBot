FROM oven/bun:latest
COPY package.json ./
COPY bun.lock ./
COPY src ./src
COPY data ./data
COPY tsconfig.json ./
RUN bun install
ARG CLIENT_ID
ARG TOKEN
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG GEMINI_API_KEY
ARG SDC_KEY
RUN bun dev