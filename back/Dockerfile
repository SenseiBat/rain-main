# Build stage - installation rapide des dépendances
FROM composer:latest AS builder
WORKDIR /app

COPY composer.json composer.lock* ./

# Installation ultra-rapide avec cache
RUN --mount=type=cache,target=/tmp/cache \
    composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --classmap-authoritative \
    --ignore-platform-reqs

# Runtime stage - image finale ultra-minimale
FROM php:8.2-cli-alpine

# Cache APK et installation ultra-rapide
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache postgresql-libs curl \
    && apk add --no-cache --virtual .build-deps postgresql-dev \
    && docker-php-ext-install pdo_pgsql \
    && apk del .build-deps

WORKDIR /var/www/html

# Copier vendor depuis le builder
COPY --from=builder /app/vendor ./vendor

# Copier les fichiers Laravel essentiels en un bloc
COPY artisan composer.json composer.lock docker-entrypoint.sh ./
COPY app app
COPY bootstrap bootstrap
COPY config config
COPY database database
COPY routes routes
COPY resources resources
COPY public public

# Setup rapide en une seule commande
RUN mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && mv docker-entrypoint.sh /usr/local/bin/ \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

