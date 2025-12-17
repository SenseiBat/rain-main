# 🔄 Communication Frontend ↔️ Backend

## Vue d'ensemble

Le message "Hello depuis Laravel !" affiché sur la page d'accueil est le résultat d'une communication **HTTP REST** entre :
- **Frontend** : React (port 5179) via Docker
- **Backend** : Laravel (port 8009) via Docker

```
┌─────────────────────┐         HTTP GET         ┌─────────────────────┐
│                     │    ──────────────────>    │                     │
│   React Frontend    │   /api/message           │   Laravel Backend   │
│   (port 5179)       │                           │   (port 8009)       │
│                     │    <──────────────────    │                     │
└─────────────────────┘    JSON Response         └─────────────────────┘
                           {message: "Hello..."}
```

---

## 📍 Architecture complète

### 1️⃣ **Backend Laravel** (Serveur API)

#### Routes (`back/routes/web.php`)
```php
use App\Http\Controllers\ApiController;

// Groupe de routes pour l'API
Route::prefix('api')->group(function () {
    Route::get('/message', [ApiController::class, 'message']);
});
```
- **Endpoint** : `GET /api/message`
- **URL complète** : `http://localhost:8009/api/message`
- **Accessible depuis** : N'importe quel client HTTP

#### Controller (`back/app/Http/Controllers/ApiController.php`)
```php
class ApiController extends Controller
{
    public function message(): JsonResponse
    {
        return response()->json([
            'message' => 'Hello depuis Laravel !',
            'timestamp' => now()->toIso8601String(),
            'status' => 'ok',
        ]);
    }
}
```

**Réponse JSON :**
```json
{
  "message": "Hello depuis Laravel !",
  "timestamp": "2025-12-16T10:27:54+00:00",
  "status": "ok"
}
```

---

### 2️⃣ **Frontend React** (Client)

#### Configuration (`front/src/constants/index.ts`)
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8009'
```
- **Par défaut** : `http://localhost:8009`
- **Personnalisable** : via variable d'environnement `VITE_API_URL`

#### Hook personnalisé (`front/src/hooks/useBackendMessage.tsx`)
```typescript
export function useBackendMessage() {
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const backendUrl = `${API_BASE_URL}/api/message`
    
    fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { message, isLoading, error }
}
```

**Ce hook :**
- ✅ Lance un appel HTTP au montage du composant
- ✅ Gère 3 états : `message`, `isLoading`, `error`
- ✅ Timeout de 5 secondes
- ✅ Gère l'annulation si composant démonté

#### Composant Home (`front/src/components/Home.tsx`)
```tsx
function Home() {
  const { message, isLoading, error } = useBackendMessage()

  return (
    <>
      {message && !isLoading && !error && (
        <section className="backend-test">
          <p>✅ Backend connecté: {message}</p>
        </section>
      )}
      {/* ... reste du composant */}
    </>
  )
}
```

**Affichage conditionnel :**
- Affiche **UNIQUEMENT** si :
  - `message` existe (non vide)
  - `isLoading` = false (requête terminée)
  - `error` = null (pas d'erreur)

---

## 🔄 Flux de communication détaillé

### Étape par étape

```
1. USER ouvre la page d'accueil (/)
   ↓
2. Composant <Home /> se monte
   ↓
3. Hook useBackendMessage() s'exécute
   ↓
4. useEffect() déclenche la requête HTTP
   ↓
5. fetch('http://localhost:8009/api/message')
   ↓
   ┌─────────────────────────────────────┐
   │  Requête HTTP GET                   │
   │  ─────────────────────────────────> │
   │                                     │
   │  Headers:                           │
   │  - Accept: application/json         │
   │  - Content-Type: application/json   │
   │  - Origin: http://localhost:5179    │
   └─────────────────────────────────────┘
   ↓
6. Laravel reçoit la requête
   ↓
7. Router trouve la route /api/message
   ↓
8. ApiController::message() s'exécute
   ↓
9. Génère la réponse JSON
   ↓
   ┌─────────────────────────────────────┐
   │  Réponse HTTP 200 OK                │
   │  <───────────────────────────────── │
   │                                     │
   │  Headers:                           │
   │  - Content-Type: application/json   │
   │                                     │
   │  Body:                              │
   │  {                                  │
   │    "message": "Hello depuis ...",   │
   │    "timestamp": "2025-...",         │
   │    "status": "ok"                   │
   │  }                                  │
   └─────────────────────────────────────┘
   ↓
10. Promise fetch se résout
    ↓
11. .then(response => response.json())
    ↓
12. .then(data => setMessage(data.message))
    ↓
13. State message est mis à jour
    ↓
14. React re-render <Home />
    ↓
15. Affichage : "✅ Backend connecté: Hello depuis Laravel !"
```

---

## 🐳 Configuration Docker

### docker-compose.yml
```yaml
services:
  # Backend Laravel
  back_vitrine:
    ports:
      - "8009:8000"  # 8009 = externe, 8000 = interne
    networks:
      - app-network_vitrine

  # Frontend React
  front_vitrine:
    ports:
      - "5179:5173"  # 5179 = externe, 5173 = interne
    networks:
      - app-network_vitrine
    depends_on:
      - back_vitrine  # Frontend attend que backend soit prêt
```

**Réseau Docker :**
- Les deux conteneurs sont sur le même réseau : `app-network_vitrine`
- Communication possible **entre conteneurs** via noms de service
- Communication depuis **l'hôte** via ports mappés

---

## 🔍 Test manuel

### Test de l'API depuis le terminal

```bash
# Test simple
curl http://localhost:8009/api/message

# Test avec formatage JSON
curl -s http://localhost:8009/api/message | python3 -m json.tool

# Test avec headers
curl -v http://localhost:8009/api/message
```

**Réponse attendue :**
```json
{
  "message": "Hello depuis Laravel !",
  "timestamp": "2025-12-16T10:27:54+00:00",
  "status": "ok"
}
```

### Test depuis le navigateur

1. Ouvrir : `http://localhost:5179`
2. Vérifier le message en haut de page : **"✅ Backend connecté: Hello depuis Laravel !"**

### Debug avec DevTools

```javascript
// Console du navigateur
fetch('http://localhost:8009/api/message')
  .then(r => r.json())
  .then(console.log)

// Résultat :
// {message: "Hello depuis Laravel !", timestamp: "...", status: "ok"}
```

---

## ⚙️ Configuration des ports

### Pourquoi port 8009 ?

```yaml
# docker-compose.yml
back_vitrine:
  ports:
    - "8009:8000"
```

- **8009** : Port **externe** accessible depuis l'hôte (votre machine)
- **8000** : Port **interne** du conteneur Laravel (défaut PHP artisan serve)

### Modifier le port

**Option 1 : Changer dans docker-compose.yml**
```yaml
ports:
  - "9999:8000"  # Nouvelle config
```

**Option 2 : Variable d'environnement frontend**
```bash
# Créer front/.env.local
VITE_API_URL=http://localhost:9999
```

---

## 🛠️ Gestion d'erreurs

### Erreurs possibles

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Failed to fetch` | Backend non démarré | `docker-compose up -d` |
| `CORS error` | ~~Middleware CORS manquant~~ | Désormais supprimé |
| `Timeout 5s` | Backend trop lent | Vérifier les logs Laravel |
| `HTTP 404` | Route incorrecte | Vérifier `routes/web.php` |
| `HTTP 500` | Erreur PHP | Vérifier `storage/logs/laravel.log` |

### Logs Docker

```bash
# Logs du backend
docker-compose logs -f back_vitrine

# Logs du frontend
docker-compose logs -f front_vitrine

# Tous les logs
docker-compose logs -f
```

---

## 📊 Diagramme de séquence

```
Frontend (React)          Backend (Laravel)
     │                           │
     │  useEffect se déclenche   │
     ├──────────────────────────>│
     │  GET /api/message         │
     │                           │
     │                           │ Router reçoit
     │                           │ /api/message
     │                           │
     │                           │ Appelle Controller
     │                           │ ApiController::message()
     │                           │
     │                           │ Génère JSON
     │                           │ {message: "Hello..."}
     │                           │
     │<──────────────────────────┤
     │  JSON Response 200 OK     │
     │                           │
     │  setMessage(data.message) │
     │                           │
     │  React re-render          │
     │                           │
     │  Affichage "✅ Backend..."│
     │                           │
```

---

## 🚀 Améliorations possibles

### Actuellement
- ❌ Pas d'authentification
- ❌ Pas de retry automatique
- ❌ Pas de cache
- ❌ Un seul endpoint

### Futures évolutions

**1. Authentification JWT**
```typescript
fetch(backendUrl, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**2. Retry automatique**
```typescript
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (err) {
      if (i === retries - 1) throw err
      await sleep(1000 * (i + 1))
    }
  }
}
```

**3. Cache avec React Query**
```typescript
import { useQuery } from '@tanstack/react-query'

const { data } = useQuery({
  queryKey: ['backend-message'],
  queryFn: () => fetch('/api/message').then(r => r.json()),
  staleTime: 60000, // Cache 1 minute
})
```

**4. WebSocket temps réel**
```typescript
// Pour des mises à jour en temps réel
const ws = new WebSocket('ws://localhost:8009')
ws.onmessage = (event) => {
  setMessage(JSON.parse(event.data).message)
}
```

---

## 📝 Variables d'environnement

### Frontend (`front/.env` ou `.env.local`)
```bash
# URL du backend
VITE_API_URL=http://localhost:8009

# Mode de développement
VITE_DEV_MODE=true
```

### Backend (`back/.env`)
```bash
APP_URL=http://localhost:8009
APP_ENV=local
APP_DEBUG=true

# Base de données
DB_CONNECTION=pgsql
DB_HOST=db_vitrine
DB_PORT=5432
```

---

## ✅ Checklist de vérification

Avant de déboguer, vérifier :

- [ ] Conteneurs Docker démarrés : `docker-compose ps`
- [ ] Backend accessible : `curl http://localhost:8009/api/message`
- [ ] Frontend accessible : ouvrir `http://localhost:5179`
- [ ] Pas d'erreur console navigateur (F12)
- [ ] Logs backend propres : `docker-compose logs back_vitrine`

---

## 📚 Ressources

- **Laravel Docs** : https://laravel.com/docs/routing
- **Fetch API** : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **React Hooks** : https://react.dev/reference/react/hooks
- **Docker Compose** : https://docs.docker.com/compose/

---

**Date** : 16 décembre 2025  
**Version** : 1.0.0
