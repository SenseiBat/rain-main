#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# Créer et définir les permissions des dossiers storage
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 777 storage bootstrap/cache 2>/dev/null || true

# Attendre brièvement que la base de données soit prête (max 30s)
echo "⏳ Waiting for database..."
timeout=30
until php -r "new PDO('pgsql:host=db_vitrine;dbname=app_db', 'app_user', 'app_password');" 2>/dev/null || [ $timeout -eq 0 ]; do
  timeout=$((timeout - 1))
  sleep 1
done

if [ $timeout -eq 0 ]; then
  echo "⚠️  Database connection timeout, but continuing..."
fi

# Générer la clé d'application si nécessaire
if grep -q "APP_KEY=$" /var/www/html/.env 2>/dev/null || [ -z "$APP_KEY" ]; then
  echo "🔑 Generating application key..."
  php artisan key:generate --force
fi

# Exécuter les migrations en arrière-plan pour ne pas bloquer le démarrage
(sleep 5 && php artisan migrate --force 2>/dev/null) &

# Démarrer le serveur immédiatement
echo "✅ Server ready on port 8000"
exec php artisan serve --host=0.0.0.0 --port=8000
