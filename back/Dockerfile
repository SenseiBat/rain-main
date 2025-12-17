FROM php:8.2-cli

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copier les fichiers de configuration composer
COPY composer.json composer.lock ./

# Installation des dépendances PHP
RUN composer install --no-scripts --no-autoloader

# Copier le reste de l'application
COPY . .

# Finaliser l'installation composer
RUN composer dump-autoload --optimize

# Créer les répertoires nécessaires et définir les permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chmod +x docker-entrypoint.sh \
    && mv docker-entrypoint.sh /usr/local/bin/

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

