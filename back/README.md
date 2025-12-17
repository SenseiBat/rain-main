# Rain - Backend Laravel

Backend API Laravel pour le projet Rain (Site documentaire VTOM).

## 📋 Description

API REST simple construite avec **Laravel 12** pour servir le frontend React.
Fournit des endpoints pour la documentation VTOM et la communication avec le frontend.

## 🚀 Technologies

- **Laravel 12** - Framework PHP
- **PHP 8.2+** - Langage serveur
- **PostgreSQL** - Base de données
- **Docker** - Conteneurisation

## 📦 Installation

```bash
# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Lancer les migrations
php artisan migrate
```

## 🔧 Développement

```bash
# Démarrer le serveur de développement
php artisan serve

# Ou avec Docker
docker compose up -d
```

Le backend sera accessible sur `http://localhost:8000`

## 📡 Endpoints API

### GET /api/message
Endpoint de test pour vérifier la communication avec le frontend.

**Réponse:**
```json
{
    "message": "Hello depuis Laravel !",
    "timestamp": "2025-12-15T10:30:00+00:00",
    "status": "ok"
}
```

## 📁 Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Controller.php
│   │   └── ApiController.php      # API endpoints
│   └── Middleware/
│       └── Cors.php               # Middleware CORS
├── Models/
│   └── User.php
└── Providers/
    └── AppServiceProvider.php

routes/
└── web.php                         # Définition des routes

config/                             # Configuration Laravel
```

## 🛠️ Commandes utiles

```bash
# Tests
php artisan test

# Linter PHP (Pint)
./vendor/bin/pint

# Cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 📄 Licence

Ce projet est sous licence MIT.

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
