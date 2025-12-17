# Build stage - installation des dépendances
FROM composer:2 AS builder
WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist --no-interaction

# Runtime stage - image finale ultra-minimale
FROM php:8.2-cli-alpine

# Installation minimale avec Alpine (image beaucoup plus légère)
RUN apk add --no-cache \
    postgresql-libs \
    libpq \
    curl \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html

# Copier vendor depuis le builder
COPY --from=builder /app/vendor ./vendor

# Copier uniquement les fichiers nécessaires
COPY artisan composer.json composer.lock ./
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY routes ./routes
COPY resources ./resources
COPY public ./public
COPY docker-entrypoint.sh /usr/local/bin/

# Créer les répertoires et permissions en une seule couche
RUN mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

