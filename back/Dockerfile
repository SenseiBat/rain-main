# ============================================
# Stage 1: Build - Installation des dépendances
# ============================================
FROM composer:2.7 AS builder
WORKDIR /app

# Copier uniquement les fichiers de dépendances (layer cachable)
COPY composer.json composer.lock ./

# Installation ultra-rapide (cache Docker classique)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --classmap-authoritative \
    --apcu-autoloader \
    --ignore-platform-reqs

# ============================================
# Stage 2: Runtime - Image finale optimisée
# ============================================
FROM php:8.2-cli-alpine

# Installation minimale des dépendances système en une seule layer
RUN apk add --no-cache --virtual .build-deps postgresql-dev && \
    apk add --no-cache postgresql-libs curl && \
    docker-php-ext-install -j$(nproc) pdo_pgsql && \
    apk del .build-deps && \
    rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

WORKDIR /var/www/html

# Copier vendor optimisé depuis le builder
COPY --from=builder /app/vendor ./vendor

# Copier tous les fichiers de l'application en une seule layer
COPY . .

# Setup final: création des dossiers + permissions + entrypoint
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache && \
    chmod +x docker-entrypoint.sh && \
    mv docker-entrypoint.sh /usr/local/bin/

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

